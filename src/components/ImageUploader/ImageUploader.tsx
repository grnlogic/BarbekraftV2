import React, { useState, useRef, useCallback } from "react";
import { apiService } from "../../services";
import { DetectedObject, SuggestionResponse } from "../../types";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";

interface ImageUploaderProps {
  onProcessingComplete?: (result: SuggestionResponse) => void;
  onError?: (error: Error) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onProcessingComplete,
  onError,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [processStatus, setProcessStatus] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Load COCO-SSD model
  const [model, setModel] = useState<any>(null);
  const [isModelLoading, setIsModelLoading] = useState<boolean>(false);

  // Load the TensorFlow model when needed
  const loadModel = useCallback(async () => {
    try {
      setIsModelLoading(true);
      setProcessStatus("Loading TensorFlow object detection model...");

      // Dynamic import of COCO-SSD to reduce initial bundle size
      const cocoSsd = await import("@tensorflow-models/coco-ssd");
      const loadedModel = await cocoSsd.load();

      setModel(loadedModel);
      setIsModelLoading(false);
      setProcessStatus("Model loaded successfully");
      return loadedModel;
    } catch (error) {
      console.error("Failed to load COCO-SSD model:", error);
      setErrorMessage(
        "Failed to load object detection model. Please try again."
      );
      setIsModelLoading(false);
      if (onError) onError(error as Error);
      return null;
    }
  }, [onError]);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      // Validate file type
      if (!file.type.includes("image/")) {
        setErrorMessage("Please select an image file.");
        return;
      }

      setSelectedFile(file);

      // Create image preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Reset states
      setDetectedObjects([]);
      setErrorMessage(null);
    }
  };

  // Process the image with TensorFlow
  const detectObjects = async () => {
    if (!preview || !imageRef.current) return [];

    try {
      setProcessStatus("Detecting objects in image...");

      // Load model if not already loaded
      const detectionModel = model || (await loadModel());
      if (!detectionModel) {
        throw new Error("Could not load object detection model");
      }

      // Prepare the image
      const img = imageRef.current;

      // Run detection
      const predictions = await detectionModel.detect(img, 20); // Detect up to 20 objects

      // Convert to our format
      return predictions.map((prediction: any) => ({
        class: prediction.class,
        score: prediction.score,
        bbox: prediction.bbox,
      })) as DetectedObject[];
    } catch (error) {
      console.error("Object detection failed:", error);
      throw error;
    }
  };

  // Process the image with our AI pipeline
  const processImage = async () => {
    if (!preview || !imageRef.current) {
      setErrorMessage("Please select an image first.");
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMessage(null);

      // Step 1: Detect objects
      const detectedObjects = await detectObjects();
      setDetectedObjects(detectedObjects);

      if (detectedObjects.length === 0) {
        setErrorMessage(
          "No objects detected in the image. Please try another image."
        );
        setIsProcessing(false);
        return;
      }

      // Log the detected objects
      console.log("Detected objects:", detectedObjects);
      setProcessStatus("Processing detected objects with AI...");

      // Step 2: Get craft suggestions from AI
      const suggestion = await apiService.suggestCrafts(detectedObjects);

      // Step 3: Send result to parent component
      if (onProcessingComplete) {
        onProcessingComplete(suggestion);
      }

      setProcessStatus("Processing complete!");
      setIsProcessing(false);
    } catch (error) {
      console.error("Error processing image:", error);
      setErrorMessage("Failed to process image. Please try again.");
      setIsProcessing(false);
      if (onError) onError(error as Error);
    }
  };

  // Trigger file selection dialog
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="image-uploader max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-green-600">
        Unggah Gambar Barang Bekas
      </h2>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Upload button or drag-drop area */}
      <div
        onClick={openFileDialog}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-green-500 transition duration-300"
      >
        {!preview ? (
          <div>
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-600">
              Klik untuk upload atau drag and drop
            </p>
            <p className="mt-1 text-xs text-gray-500">
              PNG, JPG, GIF hingga 10MB
            </p>
          </div>
        ) : (
          <div className="relative">
            <img
              ref={imageRef}
              src={preview}
              alt="Preview"
              className="max-h-64 mx-auto rounded"
              crossOrigin="anonymous"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPreview(null);
                setSelectedFile(null);
                setDetectedObjects([]);
              }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Error message */}
      {errorMessage && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {errorMessage}
        </div>
      )}

      {/* Process button */}
      {preview && !isProcessing && (
        <div className="mt-4">
          <button
            onClick={processImage}
            disabled={isProcessing || isModelLoading}
            className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 disabled:opacity-50"
          >
            {isModelLoading ? "Loading model..." : "Proses Gambar"}
          </button>
        </div>
      )}

      {/* Loading indicator */}
      {isProcessing && (
        <div className="mt-4 p-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">{processStatus}</p>
        </div>
      )}

      {/* Show detected objects */}
      {detectedObjects.length > 0 && !isProcessing && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Objek Terdeteksi:</h3>
          <ul className="space-y-1">
            {detectedObjects.map((obj, index) => (
              <li key={index} className="flex justify-between">
                <span className="capitalize">{obj.class}</span>
                <span className="text-sm text-gray-500">
                  {Math.round(obj.score * 100)}% confidence
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
