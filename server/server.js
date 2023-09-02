const path = require("path");
const http = require("http");
const socketIO = require("socket.io");
const express = require("express");

const publicPath = path.join(__dirname + "/../public");
const port = process.env.PORT || 3000;
const { genrateMessage } = require("./utils/message");
const { realstring } = require("./utils/realstring");
const { Users } = require("./utils/users");
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();

app.use(express.static(publicPath));

io.on("connection", (socket) => {
  console.log("A new user is connected!");

  socket.on("join", (params, callback) => {
    if (!realstring(params.name) || !realstring(params.room)) {
      return callback("Name and room are must required!");
    }
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit("updateUsersList", users.getUserList(params.room));
    socket.emit(
      "newMessage",
      genrateMessage("Admin", `Welcome to the ${params.room}!`)
    );

    socket.broadcast
      .to(params.room)
      .emit("checkmessage", genrateMessage("Admin", "New User Joined!"));
  });

  socket.on("createMessage", (message, callback) => {
   let user = users.getUser(socket.id);

  if(user && realstring(message.text)){
      io.to(user.room).emit('sendMessage', genrateMessage(user.name, message.text));
  }
  callback('This is the server:');
  });
  socket.on('disconnect', () => {
    let user = users.removeUser(socket.id);
    if(user){
      io.to(user.room).emit('updateUsersList', users.getUserList(user.room));
      io.to(user.room).emit('checkmessage',genrateMessage('Admin', `${user.name} has left form  ${user.room}`))
    }
  });
});

server.listen(port, () => {
  console.log("port is running sucessfully");
});
