import axios from "axios";

/**
 * Check if OpenAI API key is valid and working
 */
export async function checkOpenAIStatus(): Promise<boolean> {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

  if (!apiKey) {
    return false;
  }

  try {
    // Make a minimal API call to check connectivity and quota
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "Test API connectivity" }],
        max_tokens: 5,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    return true;
  } catch (error: any) {
    return false;
  }
}

/**
 * Check if Gemini API key is valid and working
 */
export async function checkGeminiStatus(): Promise<boolean> {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

  if (!apiKey) {
    return false;
  }

  try {
    // Make a minimal API call to check connectivity
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: "Test API connectivity" }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 10,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return true;
  } catch (error: any) {
    return false;
  }
}
