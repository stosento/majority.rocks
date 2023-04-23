const colors = require('./colors');

const express = require('express');
const path = require('path');
const request = require('request');
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
require('dotenv').config({path: '../.env'});

const client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
const client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI; // Your redirect uri
const frontend_uri = process.env.SPOTIFY_FRONTEND_URI;
const port = process.env.PORT || 8888;
const frontendPort = 3000

var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';

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

const http = require('http').createServer(app);

app.get('/login', function(req, res) {

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
        res.redirect(frontend_uri + '/create' + '#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect(frontend_uri + '#' + 
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
    createRoom(data.roomCode, userInfo, data.skipRule)

    // Add socket to specific room
    console.log(`user ${socket.id} joining room ${data.roomCode}`)
    socket.join(data.roomCode)

    // Emit user list to room
    console.log("Emitting roomInfo to host", roomMap.get(data.roomCode));
    io.to(socket.id).emit("roomInfo", roomMap.get(data.roomCode));
  });

  // Joining an existing room
  socket.on('joinRoom', (data) => {

    if (roomIsValid(data.roomCode)) {
      let [color, updatedColors] = getRandomColor(availableColors);
      availableColors = updatedColors;

      const userInfo = {
        userName: data.userName, 
        color: color,
        socketId: data.socketId
      };
      console.log(`user ${socket.id} joining room ${data.roomCode}`);

      socket.join(data.roomCode);
      addToRoomMap(data.roomCode, userInfo);

      io.to(socket.id).emit('joinRoomSuccess', data.roomCode); // update single user they joined
      socket.to(data.roomCode).emit('userJoined', {name: data.userName, room: roomMap.get(data.roomCode)}); // update all other users
    } else {
      io.to(socket.id).emit("joinRoomFailed", data.roomCode);
    }
  })

  // Leave room
  socket.on('leaveRoom', (data) => {
    removeFromRoomMap(socket, data.roomCode, data.socketId);
    if (roomIsValid(data.roomCode)) {
      const name = getNameForSocketId(data.roomCode, data.socketId);
      io.to(data.roomCode).emit('userLeft', {name: name, room : roomMap.get(data.roomCode)});
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
    
    if (shouldSkip(roomInfo.skipRule, updatedSkipCount, roomInfo.users.length+1)) {
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
http.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})

// UTILITY METHODS

let availableColors = colors;

function getRandomColor(colors) {
  const index = Math.floor(Math.random() * colors.length);
  const color = colors[index];
  colors.splice(index, 1);
  console.log("color", color);
  return [color, colors];
}

function createRoom(roomCode, userInfo, skipRule) {

  let [color, updatedColors] = getRandomColor(availableColors);
  availableColors = updatedColors;

  let info = userInfo;
  info.color = color;

  console.log("skiprule", skipRule);

  //Assume there are no objects for this room at this point
  let roomInfo = {
    roomCode: roomCode,
    skipCount: 0,
    users: [],
    host: info,
    skipRule: skipRule,
    skipTarget: 1
  }

  roomMap.set(roomCode, roomInfo);
}

// Add user to our room map
function addToRoomMap(key, value) {

  //TODO - Add reconnect functionality

  let roomObject = roomMap.get(key);
  let usersArr = roomObject.users;
  usersArr.push(value);
  roomObject.skipTarget = calculateSkipTarget(usersArr.length+1, roomObject.skipRule);
  roomMap.set(key, roomObject);
}

// Remove user from our room map
function removeFromRoomMap(socket, roomCode, userId) {

  // Get room object
  let room = roomMap.get(roomCode);

  // Check to see if room object is valid
  if (room) {
    if (isHost(roomCode, userId)) {
      console.log("Deleting room", roomCode);
      roomMap.delete(roomCode);
      io.to(roomCode).emit("hostLeft");
      io.in(roomCode).socketsLeave(roomCode);
    } else {
      console.log("Removing user from Room Map", room);
      let users = room.users;
      let name = getNameForSocketId(roomCode, userId);

      //Remove current user from room user list
      users = users.filter((user) => user.socketId !== userId);
      room.users = users;
      room.skipTarget = calculateSkipTarget(users.length+1, room.skipRule);
      roomMap.set(roomCode, room);
      io.to(roomCode).emit('userLeft', {name: name, room : room});
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

// Check if user is the host
function isHost(roomCode, userId) {
  let host = roomMap.get(roomCode).host;
  return host.socketId === userId;
}

// Calculate our skip target
function calculateSkipTarget(roomCount, skipRule) {
  console.log("calculating skip target");
  let target = 1;

  if (skipRule === 'majority') {
    console.log("roomCount", roomCount);
    target = Math.floor(roomCount / 2) + 1; 
  } else if (skipRule === 'everyone') {
    target = roomCount;
  }

  console.log("target", target);

  return target;
}


// Check if we should skip the song
function shouldSkip(skipRule, skipCount, roomCount) {
  let skip = false;

  console.log("skipRule", skipRule);
  console.log("skipCount", skipCount);
  console.log("roomCount", roomCount);

  if (skipRule === 'single') {
    skip = true;
  } else if (skipRule === 'majority') {
    skip = (roomCount / skipCount) < 2;
  } else {
    skip = skipCount === roomCount;
  }

  console.log("ShouldSkip", skip);
  return skip;
}

function getNameForSocketId(roomCode, socketId) {
  const room = roomMap.get(roomCode);
  const user = room.users.filter((u) => u.socketId == socketId);

  console.log("user in helper method", user[0]);
  return user[0].userName;
}