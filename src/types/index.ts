// Type definitions for the application

export interface DetectedObject {
  class: string;
  score: number | string | null;
  bbox?: number[];
  description?: string;
}

export interface MaterialSuggestion {
  material: string;
  confidence: number;
  suggested: boolean;
  detectedObjects: string[];
}

export interface CraftRecommendation {
  nama: string;
  bahan: string[];
  langkah: string[];
  tingkatKesulitan: "Mudah" | "Sedang" | "Sulit";
  kategori: string;
  estimasiWaktu: string;
  imagePrompt: string;
  generatedImageUrl?: string;
}

export interface AIResponse {
  success: boolean;
  aiGenerated: boolean;
  recommendation: CraftRecommendation | null;
  rawResponse?: string;
  message?: string;
}

export interface SuggestionResponse {
  message: string;
  success: boolean;
  suggestion: CraftRecommendation & {
    isAI: boolean;
    aiSource: string;
    tingkatKesulitanInfo: string;
    estimasiWaktuInfo: string;
    bahanInfo: string;
    cleanResponse?: string;
  };
  materials: MaterialSuggestion[];
  detectedObjects: Array<{
    class: string;
    mappedClass: string;
    score: number;
    enhanced: number;
  }>;
  fullAIResponse?: string;
  error?: {
    message: string;
    details: any;
  };
}

export interface ImageGenerationResponse {
  success: boolean;
  imageUrl: string;
  additionalImages?: string[];
  source: "pinterest" | "unsplash" | "fallback" | "error";
  prompt: string;
  error?: string;
  errorMessage?: string;
}
