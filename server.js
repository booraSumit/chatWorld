const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const PORT = process.env.PORT || 3000;

const users = [];

//server static file
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  const socketId = socket.id; // give every connector to a unique socket id
  // join user
  socket.on("userJoin", (user) => {
    const alreadyUser = users.find((item) => user == item.user);
    if (!alreadyUser) {
      socket.broadcast.emit("userJoin", user);
      socket.emit("welcome", user);
      users.push({ user, socketId });
      //emit online for all users inculding sender
      io.emit("online", users);
    } else {
      socket.emit("userJoin", false);
    }
  });

  //usertyping
  socket.on("userTyping", (user) => {
    socket.broadcast.emit("userTyping", user);
  });
  socket.on("notTyping", (user) => {
    socket.broadcast.emit("notTyping", user);
  });

  //handle msg
  socket.on("msg", (user) => {
    user.type = "receiver";
    socket.broadcast.emit("msg", user);
  });

  // disconnect  user
  socket.on("disconnect", () => {
    const userIndex = users.findIndex((item) => item.socketId == socketId);
    io.emit("left", users[userIndex]);
    users.splice(userIndex, 1);
    io.emit("online", users);
  });
});
http.listen(PORT, () => {
  console.log(`listing on port${PORT}...`);
});
