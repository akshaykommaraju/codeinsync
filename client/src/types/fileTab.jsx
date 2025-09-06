import { FileSystemItem } from "./file";

// Factory function to create a FileTabContext-like object
const createFileTabContext = () => ({
  activeFile: null,
  setActiveFile: (file /* FileSystemItem */) => {},
  changeActiveFile: (fileId) => {},
});

export { createFileTabContext };