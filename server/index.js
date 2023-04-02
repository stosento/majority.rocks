const express = require('express')
const app = express();
const http = require('http').Server(app);
const cors = require('cors');

const frontendPort = 3000
const serverPort = 8888

app.use(cors())

const io = require('socket.io')(http, {
    cors: {
      origin: `http://localhost:${frontendPort}`
    }
  }
);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// SOCKET.IO BEHAVIOR

let users = [];

io.on('connection', (socket) => {
  console.log(`${socket.id} user connected`);

  // Listening for new user joining the room
  socket.on('newUser', (data) => {
    users.push(data);
    io.emit('userListResponse', users);
  });

  // Listening for disconnection
  socket.on('disconnect', () => {
    console.log('user disconnected');
    users = users.filter((user) => user.socketID !== socket.id);
    io.emit('userListResponse', users);
    socket.disconnect();
  });
});

http.listen(serverPort, () => {
  console.log(`listening at http://localhost:${serverPort}`)
})