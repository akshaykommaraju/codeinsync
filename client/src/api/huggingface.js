export async function generateText(prompt) {
  const HF_API_KEY = import.meta.env.VITE_HF_API_KEY;

  if (!HF_API_KEY) {
    console.error("❌ Missing Hugging Face API key in .env");
    return "Error: Missing API key";
  }

  try {
    const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "MiniMaxAI/MiniMax-M2:novita",
        messages: [
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      console.error("❌ Response error:", response.status, response.statusText);
      return "Error: Model not available or invalid key";
    }

    const data = await response.json();
    console.log("✅ Response:", data);
    return data.choices?.[0]?.message?.content || "No response generated.";
  } catch (error) {
    console.error("❌ Fetch failed:", error);
    return "Error: Network or API issue.";
  }
}