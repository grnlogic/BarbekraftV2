import objectMapping from "../utils/objectMapping";
import * as tf from "@tensorflow/tfjs";
import { DetectedObject, MaterialSuggestion } from "../types";

class MLService {
  private model: tf.GraphModel | null;
  private isModelLoaded: boolean;
  private modelPath: string;

  constructor() {
    this.model = null;
    this.isModelLoaded = false;
    this.modelPath = process.env.REACT_APP_MODEL_PATH || "/models/model.json";
  }

  /**
   * Load the ML model
   */
  public async loadModel(): Promise<boolean> {
    try {
      console.log("Loading ML model...");
      this.model = await tf.loadGraphModel(this.modelPath);
      this.isModelLoaded = true;
      console.log("ML model loaded successfully");
      return true;
    } catch (error) {
      console.error("Error loading ML model:", error);
      this.isModelLoaded = false;
      return false;
    }
  }

  /**
   * Improve confidence scores of detected objects
   */
  public async enhanceConfidence(
    objects: DetectedObject[]
  ): Promise<DetectedObject[]> {
    // If model not loaded or no objects, return as is
    if (!this.isModelLoaded || !objects || objects.length === 0) {
      return objects;
    }

    // Clone objects to avoid modifying original
    const enhancedObjects = JSON.parse(JSON.stringify(objects));

    // Apply confidence boosting based on object mapping categories
    enhancedObjects.forEach((obj: DetectedObject) => {
      const category = objectMapping[obj.class];
      if (category) {
        // Boost confidence for known recyclable categories
        const boost = this.getConfidenceBoost(category);
        // Apply boost but cap at 0.99
        obj.score = Math.min(obj.score + boost, 0.99);
      }
    });

    // Sort by confidence score
    return enhancedObjects.sort(
      (a: DetectedObject, b: DetectedObject) => b.score - a.score
    );
  }

  /**
   * Get confidence boost based on category
   */
  private getConfidenceBoost(category: string): number {
    // Different boost levels for different categories
    switch (category) {
      case "botol":
      case "kardus":
      case "kaleng":
        return 0.15; // Common recyclables get higher boost
      case "koran":
      case "kain":
        return 0.12;
      case "ban":
      case "kayu":
        return 0.1;
      default:
        return 0.05;
    }
  }

  /**
   * Suggest craft materials based on detected objects
   */
  public async suggestCraftMaterials(
    objects: DetectedObject[]
  ): Promise<MaterialSuggestion[]> {
    // Create material suggestions based on detected objects
    const materials: MaterialSuggestion[] = [];
    const categories = new Set<string>();

    // Map objects to material categories
    objects.forEach((obj) => {
      const category = objectMapping[obj.class] || obj.class;
      if (!categories.has(category)) {
        categories.add(category);

        materials.push({
          material: category,
          confidence: obj.score,
          suggested: true,
          detectedObjects: [obj.class],
        });
      } else {
        // Find existing category and update it
        const existingMaterial = materials.find((m) => m.material === category);
        if (existingMaterial) {
          // Update confidence if this object has higher confidence
          if (obj.score > existingMaterial.confidence) {
            existingMaterial.confidence = obj.score;
          }
          // Add to detected objects
          if (!existingMaterial.detectedObjects.includes(obj.class)) {
            existingMaterial.detectedObjects.push(obj.class);
          }
        }
      }
    });

    // Sort by confidence
    return materials.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Suggest crafts based on detected objects
   */
  public async suggestCrafts(objects: DetectedObject[]): Promise<{
    enhancedObjects: DetectedObject[];
    materialSuggestions: MaterialSuggestion[];
  }> {
    try {
      // Make sure model is loaded
      if (!this.isModelLoaded) {
        await this.loadModel();
      }

      // Enhance object detection
      const enhancedObjects = await this.enhanceConfidence(objects);

      // Get material suggestions
      const materialSuggestions = await this.suggestCraftMaterials(
        enhancedObjects
      );

      // Return the processed objects and material suggestions
      return {
        enhancedObjects,
        materialSuggestions,
      };
    } catch (error: any) {
      console.error("Error in ML processing:", error);
      throw new Error(
        "Gagal memproses objek dengan Machine Learning: " + error.message
      );
    }
  }
}

export default new MLService();
