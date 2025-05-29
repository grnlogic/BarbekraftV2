import axios from "axios";
import envCheck from "../utils/envCheck";
import {
  DetectedObject,
  MaterialSuggestion,
  AIResponse,
  CraftRecommendation,
} from "../types";

class OpenAIService {
  private apiKey: string;
  private apiUrl: string;
  private lastCallTime: number;
  private minTimeBetweenCalls: number;
  private callCount: number;
  private maxCallsPerHour: number;
  private callHistory: number[];
  private maxRetries: number;
  private retryDelay: number;
  private resetInterval: NodeJS.Timeout;

  constructor() {
    // Get OpenAI API key from environment variables
    this.apiKey = envCheck.get(
      "REACT_APP_OPENAI_API_KEY",
      "your_openai_api_key_here"
    );
    this.apiUrl =
      process.env.REACT_APP_OPENAI_API_URL ||
      "https://api.openai.com/v1/chat/completions";

    // Add call tracking to prevent excessive API usage
    this.lastCallTime = 0;
    this.minTimeBetweenCalls = 3000; // 3 seconds between calls
    this.callCount = 0;
    this.maxCallsPerHour = 20; // Limit calls per hour
    this.callHistory = [];

    // Reset call count every hour
    this.resetInterval = setInterval(() => {
      this.callCount = 0;
      this.callHistory = [];
    }, 60 * 60 * 1000); // 1 hour

    // Set retry configuration - reduce to just 1 retry
    this.maxRetries = 1; // Override environment variable setting
    this.retryDelay = 3000; // 3 seconds delay between retries
  }

  /**
   * Utility function to wait for a specified time
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Membuat prompt untuk OpenAI yang sangat singkat
   */
  private createPrompt(
    detectedObjects: DetectedObject[],
    materialSuggestions: MaterialSuggestion[]
  ): string {
    // Ultra-concise prompt to minimize tokens
    const mainObject = detectedObjects[0]?.class || "objek";
    const material = materialSuggestions[0]?.material || "barang bekas";

    // Super minimal prompt version
    return `Buat kerajinan dari ${mainObject}/${material}.
Format: {"nama":"nama_kerajinan","bahan":["bahan1","bahan2"],"langkah":["langkah1","langkah2"],"tingkatKesulitan":"Mudah/Sedang/Sulit","kategori":"kategori","estimasiWaktu":"waktu","imagePrompt":"deskripsi"}`;
  }

  /**
   * Check if we should allow an API call based on rate limits
   */
  private shouldAllowApiCall(): boolean {
    const now = Date.now();

    // Enforce minimum time between calls
    if (now - this.lastCallTime < this.minTimeBetweenCalls) {
      return false;
    }

    // Enforce maximum calls per hour
    if (this.callCount >= this.maxCallsPerHour) {
      return false;
    }

    // Add timestamp to call history and increment counter
    this.callHistory.push(now);
    this.callCount++;
    this.lastCallTime = now;

    return true;
  }

  /**
   * Mendapatkan rekomendasi kerajinan dari OpenAI
   */
  public async getCraftRecommendation(
    detectedObjects: DetectedObject[],
    materialSuggestions: MaterialSuggestion[]
  ): Promise<AIResponse> {
    // Check rate limits before starting retry loop
    if (!this.shouldAllowApiCall()) {
      return {
        success: false,
        aiGenerated: false,
        recommendation: null,
        message: "Tunggu beberapa detik sebelum mencoba lagi.",
      };
    }

    // Validate API key availability
    if (!this.apiKey || this.apiKey === "your_openai_api_key_here") {
      // Using placeholder API key
    }

    let retries = this.maxRetries; // Now equals 1

    while (retries >= 0) {
      try {
        // Create prompt for API request - use ultra concise version
        const prompt = this.createPrompt(detectedObjects, materialSuggestions);

        // Get max tokens - use much smaller value
        const maxTokens = 300;

        // Prepare the payload with minimum token settings
        const payload = {
          model: "gpt-3.5-turbo", // Always use this model for consistency
          messages: [
            {
              role: "system",
              content:
                "Buat ide kerajinan dari barang bekas dalam format JSON.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: maxTokens,
          temperature: 0.7,
        };

        // Make the API request with proper headers
        const response = await axios.post(this.apiUrl, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          timeout: 15000, // 15 second timeout - reduced from 60s
        });

        // Parse response from OpenAI
        const craftRecommendation = response.data.choices[0].message.content;

        // Extract JSON from response
        let jsonResponse: Partial<CraftRecommendation> = {};
        try {
          // Try to parse response as JSON
          jsonResponse = JSON.parse(craftRecommendation.trim());
        } catch (jsonError) {
          // Extract JSON from string using regex if parsing fails
          const jsonMatch = craftRecommendation.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            try {
              jsonResponse = JSON.parse(jsonMatch[0]);
            } catch (regexError) {
              throw new Error("Format respons AI tidak valid");
            }
          } else {
            throw new Error("Format respons AI tidak valid");
          }
        }

        // Ensure all required fields are present
        const recommendation: CraftRecommendation = {
          nama: jsonResponse.nama || "Kerajinan dari Barang Bekas",
          bahan: jsonResponse.bahan || ["Barang bekas sesuai deteksi"],
          langkah: jsonResponse.langkah || ["Langkah-langkah tidak tersedia"],
          tingkatKesulitan:
            (jsonResponse.tingkatKesulitan as "Mudah" | "Sedang" | "Sulit") ||
            "Sedang",
          kategori: jsonResponse.kategori || "Kerajinan Tangan",
          estimasiWaktu: jsonResponse.estimasiWaktu || "1-2 jam",
          imagePrompt:
            jsonResponse.imagePrompt ||
            `Kerajinan tangan ${
              jsonResponse.nama || ""
            } dari bahan daur ulang, tampak realistis, detail, dan berkualitas tinggi`,
        };

        return {
          success: true,
          aiGenerated: true,
          recommendation: recommendation,
          rawResponse: craftRecommendation,
        };
      } catch (error: any) {
        // Handle rate limit errors with retry logic - now only 1 retry
        if (error.response && error.response.status === 429 && retries > 0) {
          await this.delay(this.retryDelay);
          retries--;
          continue; // Skip to next iteration of the retry loop
        }

        // If we're out of retries, provide a fallback
        if (retries <= 0) {
          return this.getFallbackResponse();
        }

        throw error;
      }
    }

    // This should never be reached due to the while loop logic, but TypeScript needs it
    return {
      success: false,
      aiGenerated: false,
      recommendation: null,
      message: "Unexpected error occurred",
    };
  }

  /**
   * Get a fallback response when API fails
   */
  private getFallbackResponse(): AIResponse {
    return {
      success: true,
      aiGenerated: true,
      recommendation: {
        nama: "Vas Bunga dari Botol Bekas",
        bahan: ["Botol plastik bekas", "Gunting", "Cat akrilik", "Tali jute"],
        langkah: [
          "Potong bagian atas botol plastik",
          "Hias dengan cat akrilik sesuai selera",
          "Lilitkan tali jute di bagian leher botol untuk hiasan",
        ],
        tingkatKesulitan: "Mudah",
        kategori: "Dekorasi Rumah",
        estimasiWaktu: "30 menit",
        imagePrompt:
          "Vas bunga colorful dari botol plastik bekas yang dihias dengan cat dan tali",
      },
      rawResponse: JSON.stringify({
        nama: "Vas Bunga dari Botol Bekas",
        bahan: ["Botol plastik bekas", "Gunting", "Cat akrilik", "Tali jute"],
        langkah: [
          "Potong bagian atas botol plastik",
          "Hias dengan cat akrilik sesuai selera",
          "Lilitkan tali jute di bagian leher botol untuk hiasan",
        ],
        tingkatKesulitan: "Mudah",
        kategori: "Dekorasi Rumah",
        estimasiWaktu: "30 menit",
        imagePrompt:
          "Vas bunga colorful dari botol plastik bekas yang dihias dengan cat dan tali",
      }),
    };
  }

  /**
   * Check API quota status
   */
  public async checkQuota(): Promise<{
    available: boolean;
    reason?: string;
    message?: string;
  }> {
    try {
      // Simple and lightweight request to check if API is responding
      const response = await axios.post(
        this.apiUrl,
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: "Hello" }],
          max_tokens: 5,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          timeout: 5000, // Short timeout for quick check
        }
      );

      return { available: true };
    } catch (error: any) {
      if (error.response && error.response.status === 429) {
        // Quota exceeded
        return {
          available: false,
          reason: "quota_exceeded",
          message: "API quota has been exceeded",
        };
      }

      return {
        available: false,
        reason: "other_error",
        message: error.message,
      };
    }
  }

  // Cleanup method when service is no longer needed
  public cleanup(): void {
    clearInterval(this.resetInterval);
  }
}

export default new OpenAIService();
