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
        throw new Error("Format objek tidak valid. Harap berikan array objek.");
      }

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

      // Use the appropriate AI service based on configuration
      let aiRecommendation;
      try {
        if (this.preferredService === "gemini") {
          aiRecommendation = await geminiService.getCraftRecommendation(
            enhancedObjects,
            materialSuggestions
          );
        } else {
          aiRecommendation = await openaiService.getCraftRecommendation(
            enhancedObjects,
            materialSuggestions
          );
        }

        if (!aiRecommendation.success || !aiRecommendation.recommendation) {
          throw new Error(
            "AI tidak dapat memberikan rekomendasi. Silakan coba lagi dengan objek yang berbeda."
          );
        }

        // 3. Return the complete recommendation to client
        return {
          success: true,
          message: "Rekomendasi kerajinan berhasil digenerate",
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
            score: typeof obj.score === "number" ? obj.score : 0,
            enhanced: typeof obj.score === "number" ? obj.score : 0, // Since Gemini objects are already enhanced
          })),
          fullAIResponse: aiRecommendation.rawResponse,
        };
      } catch (aiError: any) {
        // Log details about the error
        if (aiError.response) {
          // API response error details available
        }

        // Try the alternative AI service if the first one fails
        const alternativeService =
          this.preferredService === "gemini" ? "openai" : "gemini";

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
            message: `Rekomendasi kerajinan berhasil digenerate menggunakan ${alternativeService}`,
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
              score: typeof obj.score === "number" ? obj.score : 0,
              enhanced: typeof obj.score === "number" ? obj.score : 0, // Since Gemini objects are already enhanced
            })),
            fullAIResponse: alternativeRecommendation.rawResponse,
          };
        } catch (alternativeError) {
          throw new Error(
            "Semua layanan AI gagal memberikan rekomendasi. Silakan coba lagi nanti."
          );
        }
      }
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Generate an image based on a prompt
   */
  public async generateImage(
    searchQuery: string
  ): Promise<ImageGenerationResponse> {
    try {
      if (!searchQuery) {
        throw new Error("Kata kunci pencarian tidak boleh kosong");
      }

      // Encode kueri untuk URL
      const encodedQuery = encodeURIComponent(searchQuery);

      // --- Coba Pinterest (via lolhuman) ---
      try {
        const apiKey = envCheck.get("REACT_APP_LOLHUMAN_API_KEY");
        if (!apiKey) {
          throw new Error("API Key Lolhuman tidak ada");
        }
        const pinterestApiUrl = `https://api.lolhuman.xyz/api/pinterest?apikey=${apiKey}&query=${encodedQuery}`;

        const pinterestResponse = await axios.get(pinterestApiUrl, {
          timeout: 10000,
        });

        if (
          pinterestResponse.data &&
          pinterestResponse.data.status === 200 &&
          pinterestResponse.data.result
        ) {
          // Get up to 5 images from the result
          const images = Array.isArray(pinterestResponse.data.result)
            ? pinterestResponse.data.result.slice(0, 5)
            : [pinterestResponse.data.result];

          return {
            success: true,
            imageUrl: images[0], // Return the first image as primary
            additionalImages: images.slice(1), // Additional images if any
            source: "pinterest",
            prompt: searchQuery,
          };
        }
      } catch (pinterestError) {
        // Pinterest API failed
      }

      // Fallback to Unsplash
      try {
        // Menggunakan kueri yang lebih ringkas (nama kerajinan) untuk Unsplash
        const unsplashImageUrl = `https://source.unsplash.com/featured/?${encodedQuery},craft,diy`;

        return {
          success: true,
          imageUrl: unsplashImageUrl,
          source: "unsplash",
          prompt: searchQuery,
        };
      } catch (unsplashError) {
        // Unsplash API juga gagal
      }

      // --- Fallback Akhir (jika semua gagal) ---
      const fallbackImageUrl = `https://placehold.co/600x400/f0f0f0/2c3e50?text=${encodeURIComponent(
        searchQuery.substring(0, 20)
      )}`;
      return {
        success: true,
        imageUrl: fallbackImageUrl,
        source: "fallback",
        prompt: searchQuery,
      };
    } catch (error: any) {
      // Kembalikan struktur error yang konsisten
      return {
        success: false,
        imageUrl: `https://placehold.co/600x400/e0e0e0/757575?text=Error+Muat+Gambar`,
        source: "error",
        prompt: searchQuery,
        errorMessage: error.message,
      };
    }
  }
}

export default new ApiService();
