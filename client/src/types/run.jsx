// Language object example
const createLanguage = (language, version, aliases = []) => ({
  language,
  version,
  aliases,
});

// Run context object factory
const createRunContext = () => ({
  setInput: (input) => {},
  output: "",
  isRunning: false,
  supportedLanguages: [],
  selectedLanguage: createLanguage("javascript", "1.0.0", ["js"]),
  setSelectedLanguage: (language) => {},
  runCode: () => {},
});

export { createLanguage, createRunContext };