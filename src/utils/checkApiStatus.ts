import axios from "axios";

/**
 * Check if OpenAI API key is valid and working
 */
export async function checkOpenAIStatus(): Promise<boolean> {
  console.log("Checking OpenAI API key status...");

  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

  if (!apiKey) {
    console.error("❌ REACT_APP_OPENAI_API_KEY tidak ditemukan!");
    return false;
  }

  console.log(
    `✅ API Key ditemukan: ${apiKey.substring(0, 8)}...${apiKey.substring(
      apiKey.length - 4
    )}`
  );

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

    console.log("✅ API Connection successful!");
    console.log(`✅ Model access is working: ${response.data.model}`);
    return true;
  } catch (error: any) {
    console.log("❌ API Connection failed!");

    if (error.response) {
      console.error("Status Code:", error.response.status);
      console.error("Error Data:", error.response.data);

      // Check for common errors
      if (error.response.status === 401) {
        console.error(
          "❌ API key tidak valid. Cek apakah API key sudah benar dan aktif."
        );
      } else if (error.response.status === 429) {
        console.error(
          "❌ Kuota habis atau rate limit tercapai. Harap periksa billing di dashboard OpenAI."
        );
      } else if (error.response.status === 404) {
        console.error("❌ Endpoint API tidak ditemukan. Periksa URL API.");
      } else if (error.response.status >= 500) {
        console.error("❌ Server error. Coba lagi nanti.");
      }
    } else if (error.request) {
      console.error("❌ Network error atau timeout. Periksa koneksi internet.");
    } else {
      console.error("❌ Error:", error.message);
    }

    console.log("Tindakan yang disarankan:");
    console.log("1. Periksa apakah API key sudah benar");
    console.log("2. Pastikan billing di akun OpenAI sudah diatur");
    console.log("3. Cek kuota dan penggunaan di dashboard OpenAI");
    console.log("4. Jika menggunakan kartu kredit, pastikan kartu aktif");
    console.log("5. Cek apakah ada pembatasan regional untuk OpenAI");
    return false;
  }
}

/**
 * Check if Gemini API key is valid and working
 */
export async function checkGeminiStatus(): Promise<boolean> {
  console.log("Checking Gemini API key status...");

  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

  if (!apiKey) {
    console.error("❌ REACT_APP_GEMINI_API_KEY tidak ditemukan!");
    return false;
  }

  console.log(
    `✅ API Key ditemukan: ${apiKey.substring(0, 8)}...${apiKey.substring(
      apiKey.length - 4
    )}`
  );

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

    console.log("✅ Gemini API Connection successful!");
    return true;
  } catch (error: any) {
    console.log("❌ Gemini API Connection failed!");

    if (error.response) {
      console.error("Status Code:", error.response.status);
      console.error("Error Data:", error.response.data);
    } else if (error.request) {
      console.error("❌ Network error atau timeout. Periksa koneksi internet.");
    } else {
      console.error("❌ Error:", error.message);
    }

    return false;
  }
}
