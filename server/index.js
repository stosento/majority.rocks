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

// SOCKET.IO BEHAVIOR

const io = require('socket.io')(http, {
  cors: {
    origin: `http://localhost:${frontendPort}`
  }
}
);

let roomMap = [];

io.on('connection', (socket) => {
  console.log(`${socket.id} user connected`);

  // Listening for new user creating a room
  socket.on('createRoom', (data) => {

    // Update User List with host
    const userName = getPropertyVal(data, "userName");
    const socketId = getPropertyVal(data, "socketId");
    const roomCode = getPropertyVal(data, "roomCode");

    const userInfo = {userName, socketId};
    addToRoomMap(roomCode, userInfo)

    // Add socket to specific room
    socket.join(roomCode)
    console.log(`user ${socket.id} joining room ${roomCode}`)

    // Emit user list to room
    io.to(roomCode).emit('userListResponse', roomMap[roomCode]);
  });

  // Joining an existing room
  socket.on('joinRoom', (data) => {

    const roomCode = getPropertyVal(data, "roomCode");
    const socketId = getPropertyVal(data, "socketId");
    const userName = getPropertyVal(data, "userName");

    if (existsInRoomMap(roomCode)) {
      const userInfo = {userName, socketId};
  
      addToRoomMap(roomCode, userInfo);
  
      socket.join(roomCode);
      console.log(`user ${socket.id} joining room ${roomCode}`)
      io.to(socketId).emit('joinRoomSuccess', roomCode);
      io.in(roomCode).emit('userListResponse', roomMap[roomCode]);
    } else {
      io.to(socketId).emit("joinRoomFailed", roomCode);
    }
  })

  // Leaving rooms
  socket.on('disconnecting', () => {
    console.log(`user ${socket.id} leaving rooms ${new Array(...socket.rooms).join(' ')}`)
    socket.rooms.forEach(room => {
      console.log("Removing from room", room);
      removeFromRoomMap(room, socket.id)
      io.to(room).emit('userListResponse', roomMap[room])
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

function getPropertyVal(obj, dataToRetrieve) {
  return dataToRetrieve
    .split('.') // split string based on `.`
    .reduce(function(o, k) {
      return o && o[k]; // get inner property if `o` is defined else get `o` and return
    }, obj) // set initial value as object
}

// Add user to our room map
function addToRoomMap(key, value) {
  roomMap[key] = roomMap[key] || [];
  roomMap[key].push(value);
  console.log("roomMap after add", roomMap);
}

// Remove user from our room map
function removeFromRoomMap(key, value) {
  let users = roomMap[key];
  if (users) {
    console.log("Removing user from Room Map")
    users = users.filter((user) => user.socketId !== value);
    roomMap[key] = users;
  }

  if (users && users.length < 1) {
    roomMap = roomMap.filter(room => room !== key)
  }
  console.log("roomMap after remove", roomMap);
}

// Check if room exists in room map
function existsInRoomMap(key) {
  let roomExists = false;
  let value = roomMap[key];
  if (value) {
    console.log("Found a room");
    roomExists = true;
  } else {
    console.log("Room was not found");
  }
  return roomExists
}