// File name and content are just strings in JS
// (no need for type aliases like in TS)

// Factory for a FileSystemItem
const createFileSystemItem = ({
  id,
  name,
  type, // "file" | "directory"
  children = [],
  content = "",
  isOpen = false,
}) => ({
  id,
  name,
  type,
  children,
  content,
  isOpen,
});

// Factory for FileContext
const createFileContext = () => ({
  fileStructure: createFileSystemItem({ id: "root", name: "root", type: "directory" }),
  openFiles: [],
  activeFile: null,
  setActiveFile: (file) => {},
  closeFile: (fileId) => {},
  toggleDirectory: (dirId) => {},
  collapseDirectories: () => {},
  createDirectory: (parentDirId, name) => "",
  updateDirectory: (dirId, children) => {},
  renameDirectory: (dirId, newName) => {},
  deleteDirectory: (dirId) => {},
  createFile: (parentDirId, name) => "",
  updateFileContent: (fileId, content) => {},
  openFile: (fileId) => {},
  renameFile: (fileId, newName) => false,
  deleteFile: (fileId) => {},
  downloadFilesAndFolders: () => {},
});

export { createFileSystemItem, createFileContext };