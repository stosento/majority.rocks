const app = require('express')();
const http = require('http').createServer(app);
const frontendPort = 3000
const serverPort = 8888
const io = require('socket.io')(
  http, {
    cors: {
      origins: [`http://localhost:${frontendPort}`]
    }
  }
);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('my message', (msg) => {
    io.emit('my broadcast', `server: ${msg}`);
  });
});

http.listen(serverPort, () => {
  console.log(`listening at http://localhost:${serverPort}`)
})