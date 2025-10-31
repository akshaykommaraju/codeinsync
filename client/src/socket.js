import { io } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export const socket = io(BACKEND_URL, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  autoConnect: true,
  withCredentials: true,
  path: "/socket.io/",
});

socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);});

socket.on("disconnect", (reason) => {
  console.log("❌ Socket disconnected:", reason);
  if (reason === "io server disconnect") {
    socket.connect();
  }});

socket.on("connect_error", (error) => {
  console.error("❌ Connection error:", error.message);});

export default socket;
