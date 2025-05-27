import React, { useState, useRef } from "react";
import { imageAnalysisAPI } from "../../services/api";
import { apiService } from "../../services";
import { DetectedObject, SuggestionResponse } from "../../types";

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

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      if (!file.type.startsWith("image/")) {
        setErrorMessage("Silakan pilih file gambar.");
        setSelectedFile(null);
        setPreview(null);
        return;
      }

      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      setDetectedObjects([]);
      setErrorMessage(null);
      setProcessStatus("");
    }
  };

  // Proses gambar menggunakan backend (Serverless Function)
  const processImage = async () => {
    if (!selectedFile) {
      setErrorMessage("Silakan pilih gambar terlebih dahulu.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setProcessStatus("Mengirim gambar untuk analisis...");

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      // Langkah 1: Kirim gambar ke backend untuk analisis oleh Gemini
      const analysisResponse = await imageAnalysisAPI.analyzeImage(formData);
      const newDetectedObjects: DetectedObject[] =
        analysisResponse.data.detectedObjects || [];

      setDetectedObjects(newDetectedObjects);
      console.log("Objek terdeteksi (dari Gemini):", newDetectedObjects);

      if (
        newDetectedObjects.length === 0 ||
        (newDetectedObjects.length === 1 &&
          newDetectedObjects[0].class?.includes("_umum"))
      ) {
        let noObjectMessage =
          "Tidak ada objek spesifik yang terdeteksi oleh AI.";
        if (
          newDetectedObjects.length === 1 &&
          newDetectedObjects[0].description
        ) {
          noObjectMessage = `AI memberikan deskripsi: "${newDetectedObjects[0].description}". Coba gambar lain untuk deteksi objek yang lebih spesifik.`;
        }
        setErrorMessage(noObjectMessage);
        setProcessStatus(
          "Analisis selesai, namun tidak ada objek spesifik terdeteksi."
        );
        setIsProcessing(false);
        if (onError) onError(new Error(noObjectMessage));
        return;
      }

      setProcessStatus(
        "Memproses objek terdeteksi dengan AI untuk saran kerajinan..."
      );

      // Langkah 2: Dapatkan saran kerajinan dari apiService berdasarkan objek yang dideteksi Gemini
      const suggestion = await apiService.suggestCrafts(newDetectedObjects);

      if (onProcessingComplete) {
        onProcessingComplete(suggestion);
      }

      setProcessStatus("Pemrosesan selesai!");
    } catch (error: any) {
      console.error("Error saat memproses gambar:", error);
      const errMsg =
        error.response?.data?.error ||
        error.message ||
        "Gagal memproses gambar. Silakan coba lagi.";
      setErrorMessage(errMsg);
      setProcessStatus("Gagal memproses gambar.");
      if (onError) onError(new Error(errMsg));
    } finally {
      setIsProcessing(false);
    }
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  return (
    <div className="image-uploader max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-green-600">
        Unggah Gambar Barang Bekas
      </h2>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <div
        onClick={openFileDialog}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-green-500 transition duration-300"
      >
        {!preview ? (
          <div>
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-600">
              Klik untuk unggah atau seret dan lepas
            </p>
            <p className="mt-1 text-xs text-gray-500">
              PNG, JPG, GIF, WEBP, dll. hingga 10MB
            </p>
          </div>
        ) : (
          <div className="relative">
            <img
              ref={imageRef}
              src={preview}
              alt="Preview"
              className="max-h-64 mx-auto rounded"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPreview(null);
                setSelectedFile(null);
                setDetectedObjects([]);
                setErrorMessage(null);
                setProcessStatus("");
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
              aria-label="Hapus gambar"
            >
              <svg
                className="h-4 w-4"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
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

      {errorMessage && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {errorMessage}
        </div>
      )}

      {preview && !isProcessing && (
        <div className="mt-4">
          <button
            onClick={processImage}
            disabled={isProcessing}
            className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 disabled:opacity-50"
          >
            Proses Gambar
          </button>
        </div>
      )}

      {isProcessing && (
        <div className="mt-4 p-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">
            {processStatus || "Memproses..."}
          </p>
        </div>
      )}

      {detectedObjects.length > 0 && !isProcessing && !errorMessage && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">
            Objek Terdeteksi oleh AI:
          </h3>
          <ul className="space-y-1">
            {detectedObjects.map((obj, index) => (
              <li key={index} className="flex justify-between">
                <span className="capitalize">
                  {obj.class || "Tidak Diketahui"}
                </span>
                {obj.score !== undefined && obj.score !== null && (
                  <span className="text-sm text-gray-500">
                    {typeof obj.score === "number"
                      ? `${Math.round(obj.score * 100)}% keyakinan`
                      : `Skor: ${obj.score}`}
                  </span>
                )}
                {obj.description && (
                  <span className="text-sm text-gray-500 italic ml-2">
                    {obj.description}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
