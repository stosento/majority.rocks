const express = require('express');
const path = require('path');
const request = require('request');
const http = require('http').Server(app);
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
require('dotenv').config({path: '../.env'});

const client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
const client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI; // Your redirect uri
const frontend_uri = process.env.SPOTIFY_FRONTEND_URI + '#';
const port = process.env.PORT || 8888;
const frontendPort = 3000

var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

var app = express();
app.use(express.static(path.resolve(__dirname, './app/build')));
app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser());

app.get('/login', function(req, res) {

  console.log("Got to login!");
  console.log("client_id", client_id);
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'streaming user-read-private user-read-email user-read-playback-state user-modify-playback-state';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect(frontend_uri +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect(frontend_uri +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

// ----------------------------------------------------------------------------

const SkipRule = Object.freeze({
  SINGLE:   Symbol("single"),
  MAJORITY:  Symbol("majority"),
  EVERYONE: Symbol("everyone")
});

let roomMap = new Map();

// SOCKET.IO BEHAVIOR

const io = require('socket.io')(http, {
  cors: {
    origin: `http://localhost:${frontendPort}`
  }
}
);

io.on('connection', (socket) => {
  console.log(`${socket.id} user connected`);

  // Listening for new user creating a room
  socket.on('createRoom', (data) => {

    // Update User List with host
    const userInfo = {userName: data.userName, socketId: data.socketId};
    createRoom(data.roomCode, userInfo)

    // Add socket to specific room
    console.log(`user ${socket.id} joining room ${data.roomCode}`)
    socket.join(data.roomCode)

    // Emit user list to room
    console.log("Emitting userList to room", roomMap.get(data.roomCode).users);
    io.to(data.roomCode).emit('userListResponse', roomMap.get(data.roomCode).users);
  });

  // Joining an existing room
  socket.on('joinRoom', (data) => {

    if (roomIsValid(data.roomCode)) {
      const userInfo = {userName: data.userName, socketId: data.socketId};
      console.log(`user ${socket.id} joining room ${data.roomCode}`);

      socket.join(data.roomCode);
      addToRoomMap(data.roomCode, userInfo);

      io.to(socket.id).emit('joinRoomSuccess', data.roomCode); // update single user they joined
      socket.to(data.roomCode).emit('userListResponse', roomMap.get(data.roomCode).users); // update all other users
    } else {
      io.to(socket.id).emit("joinRoomFailed", data.roomCode);
    }
  })

  // Send userMap for a room
  socket.on('getRoomInfo', (roomCode) => {
    console.log("Emitting room info");
    io.to(socket.id).emit("roomInfo", roomMap.get(roomCode));
  })

  // Setting skip
  socket.on('pressSkip', (roomCode) => {
    let roomInfo = roomMap.get(roomCode);
    let updatedSkipCount = roomInfo.skipCount + 1;
    
    if (shouldSkip(roomInfo.skipRule, updatedSkipCount, roomInfo.users.length)) {
      io.to(roomCode).emit("skipSong", roomInfo.host); // host - facilitate spotify skip
      updatedSkipCount = 0;
    }
    roomInfo.skipCount = updatedSkipCount;
    roomMap.set(roomCode, roomInfo);
  })

  // Leaving rooms
  socket.on('disconnecting', () => {
    console.log(`user ${socket.id} leaving rooms ${new Array(...socket.rooms).join(' ')}`)
    socket.rooms.forEach(roomCode => {
      console.log("Removing from room", roomCode);
      removeFromRoomMap(socket, roomCode, socket.id);
    });
  })

  // Listening for disconnection
  socket.on('disconnect', () => {
    console.log(`user ${socket.id} disconnected`);
    socket.disconnect();
  });
});

// All remaining requests return the React app, so it can handle routing.

// This was throwing an ENOENT error, so commenting out for now
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, './app/build', 'index.html'));
// });

// Set Server to HTTP
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})

// http.listen(port, () => {
//   console.log(`listening at http://localhost:${port}`)
// })

// UTILITY METHODS

function createRoom(roomCode, userInfo) {

  //Assume there are no objects for this room at this point
  let roomInfo = {
    skipCount: 0,
    users: [userInfo],
    host: userInfo,
    skipRule: SkipRule.EVERYONE
  }

  roomMap.set(roomCode, roomInfo);
}

// Add user to our room map
function addToRoomMap(key, value) {

  //TODO - Add reconnect functionality

  let usersArr = []
  let roomObject = roomMap.get(key);
  if (roomObject) {
    usersArr = roomObject.users;
  } 
  usersArr.push(value);
  roomMap.set(key, roomObject);
}

// Remove user from our room map
function removeFromRoomMap(socket, roomCode, userId) {

  // Get room object
  let room = roomMap.get(roomCode);

  // Check to see if room object is valid
  if (room) {
    if (room.users && isLastUser(roomCode)) {
      console.log("Deleting room", roomCode);
      roomMap.delete(roomCode);
    } else if (room.users && isHost(roomCode, userId)) {
      console.log("Deleting room", roomCode);
      roomMap.delete(roomCode);
      io.to(roomCode).emit("hostLeft");
      io.in(roomCode).socketsLeave(roomCode);
    } else {
      console.log("Removing user from Room Map", room);
      let users = room.users;

      //Remove current user from room user list
      users = users.filter((user) => user.socketId !== userId);
      room.users = users;
      roomMap.set(roomCode, room);
      socket.to(roomCode).emit('userListResponse', roomMap.get(roomCode).users);
    }
  }
}

// Check if room exists in room map
function roomIsValid(key) {
  let roomExists = false;
  let value = roomMap.get(key);
  if (value) {
    console.log("Found a room");
    roomExists = true;
  } else {
    console.log("Room was not found");
  }
  return roomExists;
}

// Check if user is last one in room
function isLastUser(roomCode) {
  let users = roomMap.get(roomCode).users;
  return users.length === 1;
}

// Check if user is the host
function isHost(roomCode, userId) {
  let host = roomMap.get(roomCode).host;
  return host.socketId === userId;
}

// Check if we should skip the song
function shouldSkip(skipRule, skipCount, roomCount) {
  let skip = false;

  console.log("skipRule", skipRule);
  console.log("skipCount", skipCount);
  console.log("roomCount", roomCount);

  if (skipRule === SkipRule.SINGLE) {
    console.log("a");
    skip = true;
  } else if (skipRule === SkipRule.EVERYONE) {
    console.log("b");
    skip = skipCount === roomCount;
  } else {
    console.log("c");
    skip = (roomCount / skipCount) > 2;
  }


  console.log("ShouldSkip", skip);
  return skip;
}