import axios from "axios";
import {
  DetectedObject,
  MaterialSuggestion,
  AIResponse,
  CraftRecommendation,
} from "../types";
import envCheck from "../utils/envCheck";

class GeminiService {
  private apiKey: string;
  private apiUrl: string;
  private model: string;
  private lastCallTime: number;
  private minTimeBetweenCalls: number;
  private callCount: number;
  private maxCallsPerHour: number;
  private callHistory: number[];
  private maxRetries: number;
  private retryDelay: number;
  private resetInterval: NodeJS.Timeout;

  constructor() {
    this.apiKey = envCheck.get("REACT_APP_GEMINI_API_KEY");
    if (!this.apiKey) {
      // API key not set
    }
    this.apiUrl = envCheck.get(
      "REACT_APP_GEMINI_API_URL",
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
    );
    this.model = envCheck.get("REACT_APP_GEMINI_API_MODEL", "gemini-2.0-flash");

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

    // Set retry configuration
    this.maxRetries = 1; // Just one retry attempt
    this.retryDelay = 3000; // 3 seconds between retries
  }

  /**
   * Utility function to wait for a specified time
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Membuat prompt untuk Gemini yang lebih terstruktur dan menghasilkan output user-friendly
   */
  private createPrompt(
    detectedObjects: DetectedObject[],
    materialSuggestions: MaterialSuggestion[]
  ): string {
    // Get main object and material
    const mainObject = detectedObjects[0]?.class || "objek";
    const material = materialSuggestions[0]?.material || "barang bekas";

    // List additional detected objects if any
    const additionalObjects = detectedObjects
      .slice(1, 3)
      .map((obj) => obj.class)
      .join(", ");

    // Create a more detailed prompt for better responses
    return `Buat ide kerajinan menarik dari "${mainObject}" atau "${material}" ${
      additionalObjects ? `(juga terdeteksi: ${additionalObjects})` : ""
    }.
  
  PENTING: Berikan respon dalam format JSON berikut (hanya struktur JSON, tidak perlu penjelasan tambahan):
  {
    "nama": "Nama kerajinan yang kreatif dan menarik",
    "bahan": [
      "Bahan utama (${mainObject} atau ${material})",
      "2-4 bahan tambahan yang mudah didapat",
      "Alat-alat yang diperlukan"
    ],
    "langkah": [
      "Langkah 1: Deskripsi detail",
      "Langkah 2: Deskripsi detail",
      "Langkah 3: Deskripsi detail",
      "Langkah 4: Deskripsi detail",
      "Langkah 5: Deskripsi detail"
      "dan langkah seterusnya, tidak usah berpaku 5 langkah langkah, sesuaikan dengan kompleksitas kerajinan"
    ],
    "tingkatKesulitan": "Mudah/Sedang/Sulit",
    "kategori": "Dekorasi Rumah/Alat Praktis/Mainan/Aksesoris/dll",
    "estimasiWaktu": "Perkiraan waktu pengerjaan (misalnya: 30 menit)",
    "imagePrompt": "Deskripsi detail untuk menghasilkan gambar kerajinan ini"
  }
  
  Pastikan kerajinan tersebut:
  - Mudah dibuat dan praktis
  - Menggunakan material yang tersedia
  - Langkah-langkah yang jelas dan detail
  - Cocok untuk berbagai usia
  - Fungsional dan bermanfaat`;
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
   * Mendapatkan rekomendasi kerajinan dari Gemini
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
    if (!this.apiKey) {
      // API key not found
    }

    let retries = this.maxRetries;

    while (retries >= 0) {
      try {
        // Create prompt for API request
        const prompt = this.createPrompt(detectedObjects, materialSuggestions);

        // Prepare the payload for Gemini API
        const payload = {
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 600,
          },
        };

        // Make the API request to Gemini
        // Note: Gemini requires the API key in the URL as a query parameter
        const urlWithKey = `${this.apiUrl}?key=${this.apiKey}`;
        const response = await axios.post(urlWithKey, payload, {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 15000, // 15 second timeout
        });

        // Parse response from Gemini
        const responseText = response.data.candidates[0].content.parts[0].text;

        // Try to extract JSON from the text response
        let jsonResponse: Partial<CraftRecommendation> = {};
        try {
          // Remove code block markers if present
          const cleanText = responseText.replace(/```json|```/g, "");
          const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            jsonResponse = JSON.parse(jsonMatch[0]);
          } else {
            // If no JSON found, convert the text response to our required JSON format
            jsonResponse = this.convertTextToJson(cleanText);
          }
        } catch (jsonError) {
          // Convert the text response to our required JSON format
          jsonResponse = this.convertTextToJson(responseText);
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
          rawResponse: responseText,
        };
      } catch (error: any) {
        // Handle rate limit errors with retry logic
        if (error.response && error.response.status === 429 && retries > 0) {
          await this.delay(this.retryDelay);
          retries--;
          continue; // Skip to next iteration of the retry loop
        }

        // If we're out of retries, provide a fallback
        if (retries <= 0) {
          return {
            success: true,
            aiGenerated: true,
            recommendation: {
              nama: "Vas Bunga dari Botol Bekas",
              bahan: [
                "Botol plastik bekas",
                "Gunting",
                "Cat akrilik",
                "Tali jute",
              ],
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
            rawResponse: "Fallback response due to API error",
          };
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
   * Convert text response to JSON format when Gemini doesn't respond with proper JSON
   */
  private convertTextToJson(text: string): Partial<CraftRecommendation> {
    // Try to extract a craft name from the text
    let craftName = "Kerajinan dari Barang Bekas";
    const nameMatch = text.match(/(?:"|\*\*|#)([^"*#]+)(?:"|\*\*|#)/);
    if (nameMatch) {
      craftName = nameMatch[1].trim();
    }

    // Extract materials (look for bullet points or numbered lists with short items)
    let materials: string[] = [];
    const materialRegex = /(?:[\*\-•]\s*|(?:\d+\.)\s*)([^.,!?]{3,40})/g;
    let match;
    while ((match = materialRegex.exec(text)) !== null) {
      if (!match[1].trim().toLowerCase().startsWith("langkah")) {
        materials.push(match[1].trim());
      }
    }

    // Extract steps (look for numbered instructions or paragraphs that describe actions)
    let steps: string[] = [];
    const stepRegex = /(?:[\*\-•]\s*|(?:\d+\.)\s*)([^.]{10,150}\.)/g;
    while ((match = stepRegex.exec(text)) !== null) {
      if (
        match[1].trim().toLowerCase().includes("ambil") ||
        match[1].trim().toLowerCase().includes("potong") ||
        match[1].trim().toLowerCase().includes("buat") ||
        match[1].trim().toLowerCase().includes("pasang") ||
        match[1].trim().toLowerCase().includes("hias")
      ) {
        steps.push(match[1].trim());
      }
    }

    // Determine difficulty based on steps and complexity
    let difficulty: "Mudah" | "Sedang" | "Sulit" = "Sedang";
    if (steps.length <= 3) {
      difficulty = "Mudah";
    } else if (steps.length >= 7 || text.toLowerCase().includes("sulit")) {
      difficulty = "Sulit";
    }

    // Determine category based on keywords
    let category = "Kerajinan Tangan";
    if (
      text.toLowerCase().includes("dekorasi") ||
      text.toLowerCase().includes("hiasan")
    ) {
      category = "Dekorasi Rumah";
    } else if (text.toLowerCase().includes("mainan")) {
      category = "Mainan";
    } else if (text.toLowerCase().includes("aksesoris")) {
      category = "Aksesoris";
    } else if (
      text.toLowerCase().includes("alat") ||
      text.toLowerCase().includes("wadah")
    ) {
      category = "Alat Praktis";
    }

    // Determine estimated time
    let time = "1-2 jam";
    if (
      text.toLowerCase().includes("30 menit") ||
      text.toLowerCase().includes("cepat") ||
      steps.length <= 3
    ) {
      time = "30 menit";
    } else if (
      text.toLowerCase().includes("beberapa jam") ||
      steps.length >= 7
    ) {
      time = "2-3 jam";
    }

    // Create image prompt
    const imagePrompt = `Kerajinan "${craftName}" yang dibuat dari barang bekas, tampak realistis, detail tinggi, pencahayaan natural, sudut pandang jelas, background netral`;

    // Create well-formed JSON response
    return {
      nama: craftName,
      bahan:
        materials.length > 0
          ? materials.slice(0, 6)
          : ["Barang bekas sesuai deteksi"],
      langkah:
        steps.length > 0
          ? steps.slice(0, 7)
          : ["Siapkan material", "Buat sesuai panduan"],
      tingkatKesulitan: difficulty,
      kategori: category,
      estimasiWaktu: time,
      imagePrompt: imagePrompt,
    };
  }

  /**
   * Mengambil bagian raw text dari response dan mengonversinya menjadi format yang lebih user-friendly
   */
  public processResponse(rawResponse: string): string {
    // Clean up text - remove markdown, excessive newlines, etc.
    let cleanedText = rawResponse
      .replace(/\*\*/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    // Only extract text sections that are most useful
    const sections = cleanedText.split("\n\n");
    const relevantSections = sections.filter(
      (section) =>
        !section.toLowerCase().includes("tips") &&
        !section.toLowerCase().includes("catatan") &&
        !section.toLowerCase().includes("selamat berkreasi")
    );

    return relevantSections.join("\n\n");
  }

  // Cleanup method when service is no longer needed
  public cleanup(): void {
    clearInterval(this.resetInterval);
  }
}

export default new GeminiService();
