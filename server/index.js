const express = require('express')
const app = express();
const http = require('http').Server(app);
const cors = require('cors');

const frontendPort = 3000
const serverPort = 8888

app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

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

      io.to(socket.id).emit('joinRoomSuccess', data.roomCode);
      socket.to(data.roomCode).emit('userListResponse', roomMap.get(data.roomCode).users);
    } else {
      io.to(socket.id).emit("joinRoomFailed", data.roomCode);
    }
  })

  // Send userMap for a room
  socket.on('getRoomInfo', (roomCode) => {
    io.to(socket.id).emit("roomInfo", roomMap.get(roomCode));
  })

  // Setting skip
  socket.on('pressSkip', (roomCode) => {
    console.log('skip pressed');
    //TODO -- add skip to our map, count total

    // Check if skipRule == SINGLE
    
      // Emit message to skip song

    // Increment skipCount

    // Call helper method skipSong(rule, skipCount)

    // if (skipSong)

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

// Set Server to HTTP
http.listen(serverPort, () => {
  console.log(`listening at http://localhost:${serverPort}`)
})

// UTILITY METHODS

function createRoom(roomCode, userInfo) {

  //Assume there are no objects for this room at this point
  let roomInfo = {
    userCount: 1,
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
  return roomExists
}

// Check if user is last one in room
function isLastUser(roomCode) {
  let users = roomMap.get(roomCode).users;
  return users.length === 1;
}

// Check if user is the host
function isHost(roomCode, userId) {
  let retVal = false;
  let host = roomMap.get(roomCode).host;
  return host.socketId === userId;
}