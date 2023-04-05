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
    socket.join(data.roomCode)
    console.log(`user ${socket.id} joining room ${data.roomCode}`)

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
  })

  // Leaving rooms
  socket.on('disconnecting', () => {
    console.log(`user ${socket.id} leaving rooms ${new Array(...socket.rooms).join(' ')}`)
    socket.rooms.forEach(roomCode => {
      console.log("Removing from room", roomCode);
      removeFromRoomMap(roomCode, socket.id);

      // If room still exists
        //TODO -- add emit back 
      console.log("Checking room map", roomMap);
      // Else, room is gone
        //TODO -- destroy room

      // console.log("getting room map TEST", roomMap.get(roomCode));
      // io.to(room).emit('userListResponse', roomMap.get(roomCode));
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

  console.log("createRoom roomCode", roomCode);
  console.log("createRoom roomInfo", roomInfo);
  console.log("createRoom roomMap", roomMap);

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
function removeFromRoomMap(roomCode, userId) {

  // Get room object
  let room = roomMap.get(roomCode);

  // Check if room object is valid
  if (room) {
    console.log("Removing user from Room Map")
    console.log("Room details", room);

    let users = room.users;

    //Remove current user from room user list
    users = users.filter((user) => user.socketId !== userId);
    room.users = users;
    roomMap.set(roomCode, room);

    // If resulting user list < 1, get rid of the 
    if (room.users.length < 1) {
      roomMap = roomMap.delete(roomCode)
    }
  }

  console.log("roomMap after remove", roomMap);
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