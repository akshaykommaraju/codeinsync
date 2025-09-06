import { StoreSnapshot, TLRecord } from "@tldraw/tldraw";
import { RemoteUser, User, USER_STATUS } from "./user";

// DrawingData in JS can just be null or a StoreSnapshot<TLRecord>
const defaultDrawingData = null;

// Replace enum with plain object
const ACTIVITY_STATE = {
  CODING: "coding",
  DRAWING: "drawing",
};

// Factory for AppContext
const createAppContext = () => ({
  users: [],
  setUsers: (users) => {},
  currentUser: null, // should be a User object
  setCurrentUser: (user) => {},
  status: USER_STATUS.INITIAL, // default from USER_STATUS
  setStatus: (status) => {},
  activityState: ACTIVITY_STATE.CODING,
  setActivityState: (state) => {},
  drawingData: defaultDrawingData,
  setDrawingData: (data) => {},
});

export { createAppContext, ACTIVITY_STATE };