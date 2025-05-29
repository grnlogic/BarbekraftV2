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
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      createPreview(file);
      resetStates();
    }
  };

  // Buat preview gambar
  const createPreview = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Reset states
  const resetStates = () => {
    setDetectedObjects([]);
    setErrorMessage(null);
    setProcessStatus("");
  };

  // Buka kamera
  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      // Perbaiki pengecekan video tracks
      if (mediaStream.getVideoTracks().length > 0) {
        // Video tracks available
      } else {
        setErrorMessage(
          "Tidak dapat mengakses kamera. Video tracks tidak tersedia."
        );
        return;
      }

      setStream(mediaStream);
      setShowCamera(true);

      // Gunakan setTimeout untuk memastikan DOM sudah dirender
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;

          // Tambahkan event listener untuk memastikan video berjalan
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch((err) => {
              // Handle error silently
            });
          };
        }
      }, 100); // Delay 100ms untuk memastikan DOM terender
    } catch (error) {
      let errorDetail = "";
      if (error instanceof Error) {
        errorDetail = error.message;
      } else {
        errorDetail = String(error);
      }
      setErrorMessage(
        "Tidak dapat mengakses kamera. Pastikan browser memiliki izin kamera. Detail: " +
          errorDetail
      );
    }
  };
  // Ambil foto dari kamera
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        // Set ukuran canvas sesuai video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Gambar frame video ke canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Konversi canvas ke blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], "camera-photo.jpg", {
                type: "image/jpeg",
              });
              setSelectedFile(file);

              // Buat preview dari canvas
              const imageDataUrl = canvas.toDataURL("image/jpeg");
              setPreview(imageDataUrl);

              resetStates();
              closeCamera();
            }
          },
          "image/jpeg",
          0.8
        );
      }
    }
  };

  // Tutup kamera
  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setShowCamera(false);
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
      const suggestionResponse = await apiService.suggestCrafts(
        newDetectedObjects
      );

      if (suggestionResponse.success && suggestionResponse.suggestion) {
        let finalSuggestion = suggestionResponse.suggestion;
        let imageUrlForResult: string | undefined = undefined;

        // Periksa apakah ada imagePrompt dan coba generate/cari gambar
        if (
          finalSuggestion.imagePrompt &&
          finalSuggestion.imagePrompt.trim() !== ""
        ) {
          setProcessStatus("Mencari gambar ilustrasi untuk kerajinan...");
          try {
            const imageResult = await apiService.generateImage(
              finalSuggestion.imagePrompt
            );
            if (imageResult.success && imageResult.imageUrl) {
              imageUrlForResult = imageResult.imageUrl;
            }
          } catch (imgError) {
            // Handle error silently
          }
        }

        // Gabungkan hasil akhir untuk dikirim ke onProcessingComplete
        const resultForParent = {
          ...suggestionResponse,
          generatedImageUrl: imageUrlForResult,
        };

        if (onProcessingComplete) {
          onProcessingComplete(resultForParent);
        }

        setProcessStatus("Pemrosesan selesai!");
      } else {
        // Tangani jika suggestionResponse tidak sukses atau suggestion null
        setErrorMessage(
          suggestionResponse.message || "Gagal mendapatkan saran kerajinan."
        );
        setProcessStatus("Gagal mendapatkan saran kerajinan.");
        if (onError)
          onError(
            new Error(
              suggestionResponse.message || "Gagal mendapatkan saran kerajinan."
            )
          );
      }
    } catch (error: any) {
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

  // Bersihkan semua
  const clearAll = () => {
    setPreview(null);
    setSelectedFile(null);
    setDetectedObjects([]);
    setErrorMessage(null);
    setProcessStatus("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
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

      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleFileChange}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      <canvas ref={canvasRef} className="hidden" />

      {showCamera ? (
        <div className="camera-container mb-4">
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-64 object-cover"
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  videoRef.current.play().catch((err) => {
                    // Handle error silently
                  });
                }
              }}
              onCanPlay={() => {
                if (videoRef.current && videoRef.current.paused) {
                  videoRef.current.play().catch((err) => {
                    // Handle error silently
                  });
                }
              }}
              onPlay={() => {
                // Video started playing
              }}
              onError={(e) => {
                // Handle video error silently
              }}
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
              <button
                onClick={capturePhoto}
                className="bg-white text-black p-3 rounded-full hover:bg-gray-100 transition duration-300"
                aria-label="Ambil foto"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
              <button
                onClick={closeCamera}
                className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition duration-300"
                aria-label="Tutup kamera"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
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
          </div>
        </div>
      ) : (
        <>
          {/* Tombol pilihan upload */}
          <div className="flex space-x-4 mb-4">
            <button
              onClick={openFileDialog}
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center space-x-2"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <span>Pilih File</span>
            </button>
            <button
              onClick={openCamera}
              className="flex-1 py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 flex items-center justify-center space-x-2"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>Buka Kamera</span>
            </button>
          </div>

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
                    clearAll();
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
        </>
      )}

      {errorMessage && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {errorMessage}
        </div>
      )}

      {preview && !isProcessing && !showCamera && (
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
