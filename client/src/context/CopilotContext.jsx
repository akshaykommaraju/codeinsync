import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import { generateText as generateCode } from "../api/huggingface"; // ✅ Correct import

const CopilotContext = createContext(null);

// Custom hook to use the context
export const useCopilot = () => {
  const context = useContext(CopilotContext);
  if (context === null) {
    throw new Error("useCopilot must be used within a CopilotContextProvider");
  }
  return context;
};

const CopilotContextProvider = ({ children }) => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const generateCodeHandler = async () => {
    try {
      if (input.trim().length === 0) {
        toast.error("Please write a prompt");
        return;
      }

      toast.loading("Generating code...");
      setIsRunning(true);

      const prompt = `
You are a code generation assistant for the project "Code Sync".
Generate accurate, complete, and clean code ONLY.
Format the response inside Markdown code blocks using the correct language syntax.
No explanations or extra text.
Prompt: ${input}
`;

      const code = await generateCode(prompt);

      if (code) {
        toast.success("Code generated successfully");
        setOutput(code);
      } else {
        toast.error("No response received");
      }
    } catch (error) {
      console.error("❌ Code generation error:", error);
      toast.error("Failed to generate the code");
    } finally {
      toast.dismiss();
      setIsRunning(false);
    }
  };

  return (
    <CopilotContext.Provider
      value={{
        setInput,
        output,
        isRunning,
        generateCode: generateCodeHandler,
      }}
    >
      {children}
    </CopilotContext.Provider>
  );
};

export { CopilotContextProvider };
export default CopilotContext;