const express = require('express');
const http = require('http');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8080;
const socketIo = require('socket.io');
const io = socketIo(server, {
  cors: {
    origin: 'https://jeandct-chat.herokuapp.com',
    // origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const router = require('./routes/index');
app.use(router);
app.use(
  cors({
    origin: 'https://jeandct-chat.herokuapp.com/',
  })
);

io.on('connection', (socket) => {
  let users = [];
  socket.emit('connection', `Client connected as id : ${socket.id}`);
  console.log(io.engine.clientsCount);
  // socket.emit('FromAPI', 'Hello user ! You are connected as' + socket.id);
  socket.on('user_message', (message) => {
    console.log(message);
    io.emit('chat_message', message);
  });

  socket.on('user_connected', (user) => {
    users.push(user);
    io.emit('all_users_connected', users);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening port : ${PORT}`);
});
