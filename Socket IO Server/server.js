require("dotenv").config();

const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

const http = require("http");
const server = http.createServer(app);

const socketio = require("socket.io");
const io = socketio(server, {
  cors: { origin: "*" },
});

const PORT = process.env.PORT || 6767;
const seperateConnections = [];

io.on("connection", (socket) => {
  console.log("Connection is working fine!");

  socket.on("joined", (userId) => {
    seperateConnections[userId] = socket.id;
  });

  socket.on("sendMessage", ({ messageBody, to }) => {
    socket.broadcast
      .to(seperateConnections[to])
      .emit("recieveMessage", messageBody);
  });

  socket.on("disconnect", () => {
    console.log("Disconnection is also fine bro!");
  });
});

const router = require("./router");
app.use(router);

server.listen(PORT, () => {
  console.log(`Socket Io server side is running on ${PORT}`);
});
