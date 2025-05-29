import React, { useState } from "react";
import { InstagramService } from "../../";
import { SuggestionResponse } from "../../types";
import instagramService from "../../services/InstagramService";
import html2pdf from "html2pdf.js";

interface InstagramShareProps {
  result: SuggestionResponse;
}

const InstagramShare: React.FC<InstagramShareProps> = ({ result }) => {
  const [userImage, setUserImage] = useState<string>("");
  const [caption, setCaption] = useState("");
  const [showCaption, setShowCaption] = useState(false);
  const [copied, setCopied] = useState(false);
  const [includeTutorial, setIncludeTutorial] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateCaption = () => {
    if (!result?.suggestion) {
      setCaption(
        "Lihat hasil kreasi daur ulang saya! 🌱♻️ #DaurUlang #Kreatif #RamahLingkungan"
      );
      setShowCaption(true);
      return;
    }

    let generatedCaption = instagramService.generateCaption(result.suggestion);

    // Add tutorial content if option is selected
    if (includeTutorial && result.suggestion) {
      const tutorialSection = `

📋 TUTORIAL LENGKAP:
📦 Bahan yang dibutuhkan:
${result.suggestion.bahan
  .map((item, index) => `${index + 1}. ${item}`)
  .join("\n")}

🔧 Langkah-langkah:
${result.suggestion.langkah
  .map((step, index) => `${index + 1}. ${step}`)
  .join("\n")}

⏱️ Estimasi waktu: ${result.suggestion.estimasiWaktu}
📊 Tingkat kesulitan: ${result.suggestion.tingkatKesulitan}

${
  result.suggestion.bahanInfo ? `💡 Tips: ${result.suggestion.bahanInfo}` : ""
}`;

      generatedCaption += tutorialSection;
    }

    setCaption(generatedCaption);
    setShowCaption(true);
  };

  const generatePDFTutorial = async () => {
    if (!result?.suggestion) return null;

    setIsGeneratingPDF(true);

    try {
      // Create temporary element for PDF generation
      const tempElement = document.createElement("div");
      tempElement.innerHTML = `
        <div style="padding: 20px; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #16a085, #27ae60); color: white; padding: 20px; margin-bottom: 20px; border-radius: 10px;">
            <h1 style="margin: 0; font-size: 24px;">${
              result.suggestion.nama
            }</h1>
            <div style="margin-top: 10px;">
              <span style="background: rgba(255,255,255,0.2); padding: 5px 10px; border-radius: 15px; margin-right: 10px; font-size: 12px;">${
                result.suggestion.kategori
              }</span>
              <span style="background: rgba(255,255,255,0.2); padding: 5px 10px; border-radius: 15px; margin-right: 10px; font-size: 12px;">${
                result.suggestion.tingkatKesulitan
              }</span>
              <span style="background: rgba(255,255,255,0.2); padding: 5px 10px; border-radius: 15px; font-size: 12px;">${
                result.suggestion.estimasiWaktu
              }</span>
            </div>
          </div>
          
          <div style="margin-bottom: 30px;">
            <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">Bahan-bahan</h2>
            <ul style="line-height: 1.6;">
              ${result.suggestion.bahan
                .map((item) => `<li>${item}</li>`)
                .join("")}
            </ul>
            ${
              result.suggestion.bahanInfo
                ? `<p style="font-style: italic; color: #7f8c8d; margin-top: 15px;">${result.suggestion.bahanInfo}</p>`
                : ""
            }
          </div>
          
          <div style="margin-bottom: 30px;">
            <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">Langkah Pembuatan</h2>
            <ol style="line-height: 1.8;">
              ${result.suggestion.langkah
                .map((step) => `<li style="margin-bottom: 8px;">${step}</li>`)
                .join("")}
            </ol>
            ${
              result.suggestion.tingkatKesulitanInfo
                ? `<p style="font-style: italic; color: #7f8c8d; margin-top: 15px;">${result.suggestion.tingkatKesulitanInfo}</p>`
                : ""
            }
          </div>
          
          <div style="margin-top: 40px; text-align: center; color: #95a5a6; font-size: 12px;">
            <p>Tutorial dibuat dengan ${
              result.suggestion.aiSource === "gemini"
                ? "Google Gemini AI"
                : result.suggestion.aiSource
            }</p>
          </div>
        </div>
      `;

      const options = {
        margin: 1,
        filename: `tutorial-${result.suggestion.nama
          .toLowerCase()
          .replace(/\s+/g, "-")}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };

      const pdfBlob = await html2pdf()
        .set(options)
        .from(tempElement)
        .outputPdf("blob");
      return pdfBlob;
    } catch (error) {
      console.error("Error generating PDF:", error);
      return null;
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleCopyAndOpenInstagram = async () => {
    try {
      await instagramService.copyToClipboard(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);

      // Open Instagram after copying
      setTimeout(() => {
        instagramService.openInstagramApp();
      }, 500);
    } catch (error) {
      alert("Gagal menyalin caption. Silakan salin manual.");
    }
  };

  const downloadImage = () => {
    if (!userImage) return;

    const link = document.createElement("a");
    link.href = userImage;
    link.download = `${result.suggestion.nama
      .toLowerCase()
      .replace(/\s+/g, "-")}-hasil.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDFTutorial = async () => {
    const pdfBlob = await generatePDFTutorial();
    if (pdfBlob) {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(pdfBlob);
      link.download = `tutorial-${result.suggestion.nama
        .toLowerCase()
        .replace(/\s+/g, "-")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-3">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
          Share ke Instagram
        </h3>
        <p className="text-pink-100 mt-1">
          Bagikan hasil kerajinan Anda ke Instagram dengan mudah
        </p>
      </div>

      <div className="p-6">
        {/* Step 1: Upload Image */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              1
            </div>
            <h4 className="text-lg font-semibold text-gray-800">
              Upload Foto Hasil Kerajinan
            </h4>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="imageUpload"
            />
            <label
              htmlFor="imageUpload"
              className="cursor-pointer flex flex-col items-center gap-3"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Klik untuk upload foto
                </p>
                <p className="text-xs text-gray-500">JPG, PNG hingga 10MB</p>
              </div>
            </label>
          </div>
        </div>

        {/* Step 2: Preview & Actions */}
        {userImage && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <h4 className="text-lg font-semibold text-gray-800">
                Preview & Generate Caption
              </h4>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Image Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Preview Foto
                </label>
                <div className="relative">
                  <img
                    src={userImage}
                    alt="Hasil kerajinan"
                    className="w-full h-64 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                  />
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={downloadImage}
                      className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 p-2 rounded-full shadow-md transition-all"
                      title="Download foto"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Opsi Caption
                  </label>

                  {/* Tutorial inclusion option */}
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={includeTutorial}
                        onChange={(e) => setIncludeTutorial(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-blue-900">
                        Sertakan tutorial lengkap dalam caption
                      </span>
                    </label>
                    <p className="text-xs text-blue-700 mt-1 ml-7">
                      Caption akan menyertakan bahan dan langkah-langkah
                      pembuatan
                    </p>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={generateCaption}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Generate Caption Instagram
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={downloadImage}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Download Foto
                      </button>

                      <button
                        onClick={downloadPDFTutorial}
                        disabled={isGeneratingPDF}
                        className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingPDF ? (
                          <svg
                            className="w-5 h-5 animate-spin"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        )}
                        {isGeneratingPDF
                          ? "Generating..."
                          : "Download Tutorial PDF"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Caption */}
        {showCaption && caption && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <h4 className="text-lg font-semibold text-gray-800">
                Edit & Share Caption
              </h4>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Caption Instagram
                  </label>
                  <span className="text-xs text-gray-500">
                    {caption.length}/2200 karakter
                  </span>
                </div>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={12}
                  className="w-full p-4 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Caption akan muncul di sini..."
                  maxLength={2200}
                />
                {caption.length > 2000 && (
                  <p className="text-xs text-orange-600 mt-1">
                    Caption mendekati batas maksimal Instagram (2200 karakter)
                  </p>
                )}
              </div>

              <button
                onClick={handleCopyAndOpenInstagram}
                className={`w-full ${
                  copied
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                } text-white px-6 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-3`}
              >
                {copied ? (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Caption Tersalin! Membuka Instagram...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    Copy Caption & Buka Instagram
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h5 className="font-semibold text-blue-900 mb-2">
                Cara Menggunakan
              </h5>
              <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
                <li>Upload foto hasil kerajinan Anda</li>
                <li>Pilih apakah ingin menyertakan tutorial dalam caption</li>
                <li>
                  Klik "Generate Caption Instagram" untuk membuat caption
                  otomatis
                </li>
                <li>Download tutorial PDF jika diperlukan</li>
                <li>Edit caption sesuai keinginan (opsional)</li>
                <li>Klik "Copy Caption & Buka Instagram"</li>
                <li>
                  Paste caption di Instagram dan upload foto + PDF tutorial
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstagramShare;
