// Connection status constants
const USER_CONNECTION_STATUS = {
  OFFLINE: "offline",
  ONLINE: "online",
};

// User object structure example
const createUser = (username, roomId) => ({
  username,
  roomId,
});

// Remote user object structure example
const createRemoteUser = ({
  username,
  roomId,
  status = USER_CONNECTION_STATUS.OFFLINE,
  cursorPosition = 0,
  typing = false,
  currentFile = "",
  socketId = "",
  selectionStart = null,
  selectionEnd = null,
}) => ({
  username,
  roomId,
  status,
  cursorPosition,
  typing,
  currentFile,
  socketId,
  selectionStart,
  selectionEnd,
});

// User status constants
const USER_STATUS = {
  INITIAL: "initial",
  CONNECTING: "connecting",
  ATTEMPTING_JOIN: "attempting-join",
  JOINED: "joined",
  CONNECTION_FAILED: "connection-failed",
  DISCONNECTED: "disconnected",
};

export { USER_CONNECTION_STATUS, USER_STATUS, createUser, createRemoteUser };