import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === "production"
      ? [process.env.FRONTEND_URL || "https://your-app.vercel.app"]
      : ["http://localhost:5174", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const users = {};

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) users[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(users));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete users[userId];
    io.emit("getOnlineUsers", Object.keys(users));
  });

  socket.on("getOnlineUsers", () => {
    io.emit("getOnlineUsers", Object.keys(users));
  });
});

export const getReceiverSocketId = (userId) => users[userId];
export { io, app, server };