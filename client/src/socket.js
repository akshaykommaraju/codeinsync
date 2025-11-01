import { io } from "socket.io-client";

// Remove the /api/socket.io path from the backend URL if present
const backendUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/api$/, '') || "http://localhost:3000";

export const socket = io(backendUrl, {
  // Let Socket.IO handle the best transport method
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  autoConnect: true,
  withCredentials: true,
  // Enable both websocket and polling for better reliability
  transports: ["websocket", "polling"],
  // Add timeout settings
  timeout: 20000,
  // Enable debug in development
  debug: import.meta.env.DEV,
});

// Connection handlers
socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("❌ Socket disconnected:", reason);
  if (reason === "io server disconnect") {
    // Try to reconnect if server disconnects us
    socket.connect();
  }
});

socket.on("connect_error", (error) => {
  console.error("❌ Connection error:", error.message);
  // Attempt to reconnect with a delay
  setTimeout(() => {
    socket.connect();
  }, 1000);
});

// Log all events in development
if (import.meta.env.DEV) {
  const originalEmit = socket.emit;
  socket.emit = function (event, ...args) {
    console.log(`📤 Emitting ${event}`, args);
    return originalEmit.call(this, event, ...args);
  };
  
  // Log all received events
  socket.onAny((event, ...args) => {
    console.log(`📥 Received ${event}`, args);
  });
}

export default socket;
