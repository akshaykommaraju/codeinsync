const VIEWS = {
  FILES: "FILES",
  CHATS: "CHATS",
  CLIENTS: "CLIENTS",
  RUN: "RUN",
  COPILOT: "COPILOT",
  SETTINGS: "SETTINGS",
};

const ViewContext = {
  activeView: VIEWS.FILES, // default value
  setActiveView: () => {},
  isSidebarOpen: true, // default value
  setIsSidebarOpen: () => {},
  viewComponents: {}, // will hold JSX elements mapped to views
  viewIcons: {}, // will hold JSX elements mapped to views
};

export { ViewContext, VIEWS };