const socketIo = require("socket.io");
const userModel = require("./models/user.model");
const captainModel = require("./models/captain.model");

let io;

function initializeSocket(server) {
  io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("join", ({ userId, userType }) => {
      if (userType === "captain") {
        // Store captain's socket ID
        captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
      } else if (userType === "user") {
        // Store user's socket ID
        userModel.findByIdAndUpdate(userId, { socketId: socket.id });
      }
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });

    // Broadcast ride request to all captains
    socket.on("new-ride", (ride) => {
      io.emit("new-ride", ride);
    });

    // Emergency SOS events
    socket.on("emergency-sos", (emergencyData) => {
      console.log("Emergency SOS received:", emergencyData);
      io.emit("emergency-alert", emergencyData);
    });

    socket.on("emergency-accepted", (data) => {
      io.emit("emergency-accepted", data);
    });

    socket.on("emergency-status-update", (data) => {
      io.emit("emergency-status-updated", data);
    });

    // User join event for emergency notifications
    socket.on("user-join", ({ userId }) => {
      userModel.findByIdAndUpdate(userId, { socketId: socket.id });
    });
  });
}

const sendMessageToSocketId = (socketId, messageObject) => {
  console.log(messageObject);

  if (io) {
    io.to(socketId).emit(messageObject.event, messageObject.data);
  } else {
    console.log("Socket.io not initialized.");
  }
};

module.exports = { initializeSocket, sendMessageToSocketId };
