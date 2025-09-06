// src/server.js
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import fs from "fs";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

import { SocketEvent } from "./types/socket.js";   // ✅ add .js extension
import { USER_CONNECTION_STATUS } from "./types/user.js"; // ✅ add .js extension

dotenv.config();

// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

// Create HTTP server
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://localhost:5173",
      "http://localhost:5174",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
  maxHttpBufferSize: 1e8,
  pingTimeout: 60000,
  transports: ["websocket", "polling"],
});

const userSocketMap = new Map();
const roomIdToFileStructureMap = new Map();

function getUsersInRoom(roomId) {
  return Array.from(userSocketMap.values()).filter(
    (user) => user.roomId === roomId
  );
}

function getRoomId(socketId) {
  return userSocketMap.get(socketId)?.roomId || null;
}

function getUserBySocketId(socketId) {
  return userSocketMap.get(socketId) || null;
}

io.on("connection", (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  // --- all your SocketEvent handlers stay the same ---
  socket.on(SocketEvent.JOIN_REQUEST, ({ roomId, username }) => {
    const existingUsersInRoom = getUsersInRoom(roomId);
    const isUsernameExist = existingUsersInRoom.some(
      (user) => user.username === username
    );

    if (isUsernameExist) {
      io.to(socket.id).emit(SocketEvent.USERNAME_EXISTS);
      return;
    }

    const newUser = {
      username,
      roomId,
      status: USER_CONNECTION_STATUS.ONLINE,
      cursorPosition: 0,
      typing: false,
      socketId: socket.id,
      currentFile: null,
      selectionStart: undefined,
      selectionEnd: undefined,
    };

    userSocketMap.set(socket.id, newUser);
    socket.join(roomId);
    socket.broadcast.to(roomId).emit(SocketEvent.USER_JOINED, { user: newUser });

    io.to(socket.id).emit(SocketEvent.JOIN_ACCEPTED, {
      user: newUser,
      users: getUsersInRoom(roomId),
      fileStructure: roomIdToFileStructureMap.get(roomId) || [],
    });
  });

  socket.on("disconnecting", () => {
    const user = userSocketMap.get(socket.id);
    if (user) {
      userSocketMap.delete(socket.id);
      socket.broadcast
        .to(user.roomId)
        .emit(SocketEvent.USER_DISCONNECTED, { user });
      socket.leave(user.roomId);
    }
  });

  // 👉 keep the rest of your event handlers (FILES, CHAT, CURSOR, DRAWING)
});

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Listening on port ${PORT}`);
});