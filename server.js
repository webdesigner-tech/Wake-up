//Server which will handle socket io connections



const path = require('path'); //The Path module provides a way of working with directories and file paths or js path module is used to handle and transform files paths. ... This module can be imported by using the following syntax: Syntax: var path = require ("path")
const http = require('http');  //js has a built-in module called HTTP, which allows Node. js to transfer data over the Hyper Text Transfer Protocol (HTTP).
const express = require('express');//js, or simply Express, is a back end web application framework for Node. js, released as free and open-source software under the MIT License. It is designed for building web applications and APIs. It has been called the de facto standard server framework for Node.Allows to set up middlewares to respond to HTTP Requests. Defines a routing table which is used to perform different actions based on HTTP Method and URL. Allows to dynamically render HTML Pages based on passing arguments to templates.   
const socketio = require('socket.io'); //Socket.IO is a JavaScript library for realtime web applications. It enables realtime, bi-directional communication between web clients and servers. It has two parts: a client-side library that runs in the browser, and a server-side library for Node.    
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = ' Wake up  ';

// Run when client connects
io.on('connection', socket => {//io is socket(server) which  listen all  incoming event from client 
  socket.on('joinRoom', ({ username, room }) => {
    console.log("New user",{username, room});
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit('mes', formatMessage(botName, 'Welcome to Wake up!'));  // for single clients when connected  //If any new user joins , let other users connected to the server know

    // Broadcast when a user connects  , broadcast/send the msg to all except the sender who send that msg  or agr hum io.emit('message' ,'A user has joined the chat');  isse sabi ke pass msg send hoga sender ke pass bi  
    socket.broadcast
      .to(user.room)
      .emit(
        'mes',
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', { // agr hum io.emit krege  isse sabi ke pass msg send hoga sender ke pass bi  
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

   // If user Typing 

   //socket.on('Typing',  )


  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);
    socket.emit('mess', formatMessage(user.username, msg));
    socket.broadcast.to(user.room).emit('message' , formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {   //disconnect is built-in event when someone left the chat its automatically fire
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'leave',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
