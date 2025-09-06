// ChatMessage factory
const createChatMessage = ({ id, message, username, timestamp }) => ({
  id,
  message,
  username,
  timestamp,
});

// ChatContext factory
const createChatContext = () => ({
  messages: [],
  setMessages: (messages) => {},
  isNewMessage: false,
  setIsNewMessage: (isNewMessage) => {},
  lastScrollHeight: 0,
  setLastScrollHeight: (lastScrollHeight) => {},
});

export { createChatMessage, createChatContext };