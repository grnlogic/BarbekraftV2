import axios from "axios";
import geminiService from "./geminiService";
import openaiService from "./openaiService";
import objectMapping from "../utils/objectMapping";
import envCheck from "../utils/envCheck";
import {
  DetectedObject,
  SuggestionResponse,
  ImageGenerationResponse,
  CraftRecommendation,
} from "../types";

class ApiService {
  private preferredService: "gemini" | "openai";

  constructor() {
    // Configuration for services
    this.preferredService =
      (process.env.REACT_APP_PREFERRED_AI as "gemini" | "openai") || "gemini";

    // Log available environment variables to help with debugging
    envCheck.logAvailable();

    console.log(
      `API Service initialized with preferred AI: ${this.preferredService}`
    );
  }

  /**
   * Get info about difficulty level
   */
  private getTingkatKesulitanInfo(level: string): string {
    switch (level.toLowerCase()) {
      case "mudah":
        return "Cocok untuk pemula, anak-anak dengan bantuan orang tua, atau pengerjaan cepat.";
      case "sulit":
        return "Membutuhkan ketelitian tinggi, alat khusus, atau pengalaman sebelumnya.";
      default: // sedang
        return "Dapat dikerjakan oleh kebanyakan orang dengan keterampilan dasar.";
    }
  }

  /**
   * Get info about time estimation
   */
  private getEstimasiWaktuInfo(waktu: string): string {
    if (waktu.includes("30 menit")) {
      return "Proyek cepat, bisa diselesaikan dalam waktu singkat.";
    } else if (waktu.includes("2-3 jam") || waktu.includes("beberapa jam")) {
      return "Proyek yang membutuhkan waktu, sebaiknya disiapkan dengan baik.";
    } else {
      return "Proyek dengan durasi menengah, bisa diselesaikan dalam satu sesi.";
    }
  }

  /**
   * Get info about materials availability
   */
  private getMaterialInfo(materials: string[]): string {
    const commonMaterials = materials.filter(
      (m) =>
        m.toLowerCase().includes("botol") ||
        m.toLowerCase().includes("kardus") ||
        m.toLowerCase().includes("gunting") ||
        m.toLowerCase().includes("lem") ||
        m.toLowerCase().includes("cat")
    );

    const rareMaterials = materials.filter(
      (m) =>
        m.toLowerCase().includes("khusus") ||
        m.toLowerCase().includes("led") ||
        m.toLowerCase().includes("elektronik")
    );

    if (rareMaterials.length > 0) {
      return "Beberapa bahan mungkin perlu dibeli khusus.";
    } else if (commonMaterials.length === materials.length) {
      return "Semua bahan mudah ditemukan di rumah atau toko terdekat.";
    } else {
      return "Sebagian besar bahan mudah didapatkan.";
    }
  }

  /**
   * Create a local fallback when AI services are unavailable
   */
  private getLocalFallback(objects: DetectedObject[]): CraftRecommendation {
    // Simple fallback based on detected objects
    const primaryObject = objects[0]?.class || "unknown";

    // Basic template for bottle fallback
    if (primaryObject === "bottle") {
      return {
        nama: "Vas Bunga dari Botol Plastik",
        bahan: ["Botol plastik bekas", "Cat akrilik", "Gunting", "Tali rami"],
        langkah: [
          "Potong botol plastik menjadi dua bagian, gunakan bagian bawah sebagai vas",
          "Bersihkan botol dari label dan kotoran",
          "Cat bagian luar botol sesuai selera",
          "Tambahkan hiasan dengan tali rami di bagian leher botol",
          "Isi dengan air dan tambahkan bunga",
        ],
        tingkatKesulitan: "Mudah",
        kategori: "Dekorasi Rumah",
        estimasiWaktu: "30 menit",
        imagePrompt:
          "Vas bunga cantik terbuat dari botol plastik bekas yang dicat warna-warni dengan hiasan tali rami",
      };
    }

    // Generic fallback for other objects
    return {
      nama: `Kerajinan dari ${primaryObject}`,
      bahan: [`${primaryObject} bekas`, "Gunting", "Lem", "Hiasan"],
      langkah: [
        "Siapkan material utama",
        "Bersihkan dari kotoran",
        "Potong sesuai pola yang diinginkan",
        "Rangkai bagian-bagian dengan lem",
        "Tambahkan hiasan sesuai selera",
      ],
      tingkatKesulitan: "Sedang",
      kategori: "Kerajinan Tangan",
      estimasiWaktu: "1 jam",
      imagePrompt: `Kerajinan tangan kreatif dari ${primaryObject} bekas yang dihias dengan indah`,
    };
  }

  /**
   * Endpoint to get craft suggestions based on detected objects
   */
  public async suggestCrafts(
    objectsFromGemini: DetectedObject[]
  ): Promise<SuggestionResponse> {
    try {
      if (!objectsFromGemini || !Array.isArray(objectsFromGemini)) {
        console.error("Invalid objects data format:", objectsFromGemini);
        throw new Error("Format objek tidak valid. Harap berikan array objek.");
      }

      console.log(
        "Objek dari Gemini untuk saran kerajinan:",
        objectsFromGemini
      );

      // Since Gemini already provides enhanced object detection, we can use the objects directly
      const enhancedObjects = objectsFromGemini; // Assume Gemini output is already "enhanced"

      // Create material suggestions directly from Gemini objects using objectMapping
      const materialSuggestions = objectsFromGemini
        .map((obj) => ({
          material:
            objectMapping[obj.class?.toLowerCase()] ||
            obj.class?.toLowerCase() ||
            "unknown",
          confidence: typeof obj.score === "number" ? obj.score : 0.7,
          suggested: true,
          detectedObjects: [obj.class],
        }))
        .slice(0, 5); // Take top materials

      console.log("Objek (dari Gemini) untuk AI teks:", enhancedObjects);
      console.log("Saran material untuk AI teks:", materialSuggestions);

      // 2. Get recommendation from AI service
      console.log(`Meminta rekomendasi dari ${this.preferredService}...`);

      // Set up structured logging for AI request
      console.log("AI Request Parameters:", {
        service: this.preferredService,
        objectCount: enhancedObjects.length,
        materialCount: materialSuggestions.length,
        timestamp: new Date().toISOString(),
      });

      // Use the appropriate AI service based on configuration
      let aiRecommendation;
      try {
        if (this.preferredService === "gemini") {
          console.log("Calling Gemini service...");
          aiRecommendation = await geminiService.getCraftRecommendation(
            enhancedObjects,
            materialSuggestions
          );
          console.log("Gemini service response received");
        } else {
          console.log("Calling OpenAI service...");
          aiRecommendation = await openaiService.getCraftRecommendation(
            enhancedObjects,
            materialSuggestions
          );
          console.log("OpenAI service response received");
        }

        console.log(
          `AI Recommendation success status: ${aiRecommendation.success}`
        );

        if (!aiRecommendation.success || !aiRecommendation.recommendation) {
          console.error("AI recommendation failed or returned empty response");
          throw new Error(
            "AI tidak dapat memberikan rekomendasi. Silakan coba lagi dengan objek yang berbeda."
          );
        }

        // Log the raw recommendation data
        console.log("AI Recommendation data:", {
          nama: aiRecommendation.recommendation.nama,
          kategori: aiRecommendation.recommendation.kategori,
          tingkatKesulitan: aiRecommendation.recommendation.tingkatKesulitan,
          bahanCount: aiRecommendation.recommendation.bahan.length,
          langkahCount: aiRecommendation.recommendation.langkah.length,
        });

        // 3. Return the complete recommendation to client
        return {
          success: true,
          suggestion: {
            ...aiRecommendation.recommendation,
            isAI: true,
            aiSource: this.preferredService,
            // Add friendly descriptions
            tingkatKesulitanInfo: this.getTingkatKesulitanInfo(
              aiRecommendation.recommendation.tingkatKesulitan
            ),
            estimasiWaktuInfo: this.getEstimasiWaktuInfo(
              aiRecommendation.recommendation.estimasiWaktu
            ),
            bahanInfo: this.getMaterialInfo(
              aiRecommendation.recommendation.bahan
            ),
            // Process the raw response for better readability
            cleanResponse:
              this.preferredService === "gemini" && aiRecommendation.rawResponse
                ? geminiService.processResponse(aiRecommendation.rawResponse)
                : aiRecommendation.rawResponse,
          },
          materials: materialSuggestions,
          detectedObjects: objectsFromGemini.map((obj) => ({
            class: obj.class,
            mappedClass: objectMapping[obj.class?.toLowerCase()] || obj.class,
            score: typeof obj.score === 'number' ? obj.score : 0,
            enhanced: typeof obj.score === 'number' ? obj.score : 0, // Since Gemini objects are already enhanced
          })),
          fullAIResponse: aiRecommendation.rawResponse,
        };
      } catch (aiError: any) {
        console.error(
          `Error dalam komunikasi dengan ${this.preferredService}:`,
          aiError
        );
        console.error("Error stack:", aiError.stack);

        // Log details about the error
        if (aiError.response) {
          console.error("API response error:", {
            status: aiError.response.status,
            data: aiError.response.data,
            headers: aiError.response.headers,
          });
        }

        // Try the alternative AI service if the first one fails
        const alternativeService =
          this.preferredService === "gemini" ? "openai" : "gemini";

        console.log(
          `Mencoba dengan layanan alternatif: ${alternativeService}...`
        );

        try {
          const alternativeRecommendation =
            alternativeService === "gemini"
              ? await geminiService.getCraftRecommendation(
                  enhancedObjects,
                  materialSuggestions
                )
              : await openaiService.getCraftRecommendation(
                  enhancedObjects,
                  materialSuggestions
                );

          console.log(
            `Rekomendasi dari ${alternativeService} berhasil diterima`
          );

          if (
            !alternativeRecommendation.success ||
            !alternativeRecommendation.recommendation
          ) {
            throw new Error(
              "Alternative AI service also failed to provide recommendation"
            );
          }

          // Return the recommendation from the alternative service
          return {
            success: true,
            suggestion: {
              ...alternativeRecommendation.recommendation,
              isAI: true,
              aiSource: alternativeService,
              tingkatKesulitanInfo: this.getTingkatKesulitanInfo(
                alternativeRecommendation.recommendation.tingkatKesulitan
              ),
              estimasiWaktuInfo: this.getEstimasiWaktuInfo(
                alternativeRecommendation.recommendation.estimasiWaktu
              ),
              bahanInfo: this.getMaterialInfo(
                alternativeRecommendation.recommendation.bahan
              ),
              cleanResponse:
                alternativeService === "gemini" &&
                alternativeRecommendation.rawResponse
                  ? geminiService.processResponse(
                      alternativeRecommendation.rawResponse
                    )
                  : alternativeRecommendation.rawResponse,
            },
            materials: materialSuggestions,
            detectedObjects: objectsFromGemini.map((obj) => ({
              class: obj.class,
              mappedClass: objectMapping[obj.class?.toLowerCase()] || obj.class,
              score: typeof obj.score === 'number' ? obj.score : 0,
              enhanced: typeof obj.score === 'number' ? obj.score : 0, // Since Gemini objects are already enhanced
            })),
            fullAIResponse: alternativeRecommendation.rawResponse,
          };
        } catch (alternativeError) {
          console.error(
            `Kedua layanan AI gagal memberikan rekomendasi:`,
            alternativeError
          );
          throw new Error(
            "Semua layanan AI gagal memberikan rekomendasi. Silakan coba lagi nanti."
          );
        }
      }
    } catch (error: any) {
      console.error("Error in suggestCrafts:", error);
      console.error("Stack trace:", error.stack);
      throw error;
    }
  }

  /**
   * Generate an image based on a prompt
   */
  public async generateImage(prompt: string): Promise<ImageGenerationResponse> {
    try {
      if (!prompt) {
        console.error("Empty prompt provided to generateImage");
        throw new Error("Prompt tidak boleh kosong");
      }

      console.log("Generating image for prompt:", prompt);

      // Extract keywords for image search
      const keywords = prompt.split(" ").slice(0, 3).join(" ");
      console.log("Searching for image with keywords:", keywords);

      // Try Pinterest API first
      try {
        const apiKey =
          process.env.REACT_APP_LOLHUMAN_API_KEY || "10dbd7bdb109b10b4f67ad1f";
        const pinterestApiUrl = `https://api.lolhuman.xyz/api/pinterest?apikey=${apiKey}&query=${encodeURIComponent(
          keywords
        )}`;

        console.log("Making request to Pinterest API:", pinterestApiUrl);

        const pinterestResponse = await axios.get(pinterestApiUrl, {
          timeout: 10000,
        });

        console.log("Pinterest API response status:", pinterestResponse.status);
        console.log(
          "Pinterest API data status:",
          pinterestResponse.data?.status
        );

        if (
          pinterestResponse.data &&
          pinterestResponse.data.status === 200 &&
          pinterestResponse.data.result
        ) {
          // Get up to 5 images from the result
          const images = Array.isArray(pinterestResponse.data.result)
            ? pinterestResponse.data.result.slice(0, 5)
            : [pinterestResponse.data.result];

          console.log(
            `Found ${images.length} Pinterest images. First image URL:`,
            images[0].substring(0, 100) + (images[0].length > 100 ? "..." : "")
          );

          return {
            success: true,
            imageUrl: images[0], // Return the first image as primary
            additionalImages: images.slice(1), // Additional images if any
            source: "pinterest",
            prompt: keywords,
          };
        } else {
          console.log(
            "Pinterest API returned no usable results:",
            pinterestResponse.data
          );
        }
      } catch (pinterestError) {
        console.error("Pinterest API failed:", pinterestError);
        console.log("Falling back to Unsplash");
      }

      // Fallback to Unsplash
      try {
        const enhancedPrompt = `${prompt}, high quality, detailed, vibrant colors, natural lighting, sustainable, upcycled, eco-friendly`;
        const encodedPrompt = encodeURIComponent(enhancedPrompt);
        const imageUrl = `https://source.unsplash.com/featured/?${encodedPrompt}`;

        console.log("Using Unsplash with URL:", imageUrl);

        // Test the Unsplash URL with a HEAD request
        await axios.head(imageUrl, { timeout: 5000 });

        return {
          success: true,
          imageUrl: imageUrl,
          source: "unsplash",
          prompt: enhancedPrompt,
        };
      } catch (unsplashError) {
        console.error("Unsplash API failed:", unsplashError);
        console.log("Falling back to reliable placeholder");
      }

      // Final fallback to a reliable placeholder service or data URI
      console.log("Using final fallback image");

      // Option 1: Use placehold.co (more reliable than placeholder.com)
      const fallbackImageUrl = `https://placehold.co/600x400/f0f0f0/2c3e50?text=${encodeURIComponent(
        "Barbekraft"
      )}`;

      // Option 2: Use a data URI as ultimate fallback (always works offline)
      const dataURIFallback =
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNHB4IiBmaWxsPSIjMmMzZTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBhbGlnbm1lbnQtYmFzZWxpbmU9Im1pZGRsZSI+QmFyYmVrcmFmdFYyPC90ZXh0Pjwvc3ZnPg==";

      return {
        success: true,
        imageUrl: fallbackImageUrl,
        source: "fallback",
        prompt: prompt,
      };
    } catch (error: any) {
      console.error("Error generating image:", error);
      console.error("Error stack:", error.stack);

      // Return a data URI as ultimate fallback in case of any error
      return {
        success: true,
        imageUrl:
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNHB4IiBmaWxsPSIjMmMzZTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBhbGlnbm1lbnQtYmFzZWxpbmU9Im1pZGRsZSI+QmFyYmVrcmFmdFYyIEZhbGxiYWNrPC90ZXh0Pjwvc3ZnPg==",
        source: "fallback",
        prompt: prompt,
      };
    }
  }
}

export default new ApiService();
