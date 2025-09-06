// Default settings object
const defaultSettings = {
  theme: "light",
  language: "en",
  fontSize: 14,
  fontFamily: "Arial",
  showGitHubCorner: true,
};

const createSettingsContext = () => ({
  ...defaultSettings,
  setTheme: (theme) => {},
  setLanguage: (language) => {},
  setFontSize: (fontSize) => {},
  setFontFamily: (fontFamily) => {},
  setShowGitHubCorner: (showGitHubCorner) => {},
  resetSettings: () => {},
});

export { defaultSettings, createSettingsContext };