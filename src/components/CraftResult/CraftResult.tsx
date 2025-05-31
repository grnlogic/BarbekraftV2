import React, { useRef } from "react";
import html2pdf from "html2pdf.js";
import { SuggestionResponse } from "../../types";

interface CraftResultProps {
  result: SuggestionResponse;
}

const CraftResult: React.FC<CraftResultProps> = ({ result }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  if (!result || !result.suggestion) {
    return null;
  }

  const { suggestion } = result;
  const generatedImageUrl = (result as any).generatedImageUrl;

  // Fungsi untuk download sebagai PDF
  const downloadAsPDF = () => {
    if (!contentRef.current) return;

    const options = {
      margin: 1,
      filename: `panduan-${suggestion.nama
        .toLowerCase()
        .replace(/\s+/g, "-")}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(options).from(contentRef.current).save();
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden relative">
        {/* Konten yang akan di-download sebagai PDF */}
        <div ref={contentRef}>
          {/* Tampilkan gambar jika ada */}
          {generatedImageUrl && (
            <img
              src={generatedImageUrl}
              alt={`Visualisasi untuk ${suggestion.nama}`}
              className="w-full h-64 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}

          <div className="bg-green-500 text-white py-4 px-6 relative">
            <h3 className="text-2xl font-bold">{suggestion.nama}</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="inline-block bg-green-600 px-2 py-1 text-xs rounded-md">
                {suggestion.kategori}
              </span>
              <span className="inline-block bg-green-600 px-2 py-1 text-xs rounded-md">
                {suggestion.tingkatKesulitan}
              </span>
              <span className="inline-block bg-green-600 px-2 py-1 text-xs rounded-md">
                {suggestion.estimasiWaktu}
              </span>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-2 text-gray-800">
                Bahan-bahan
              </h4>
              <ul className="list-disc pl-5 space-y-1">
                {suggestion.bahan.map((item, index) => (
                  <li key={index} className="text-gray-700">
                    {item}
                  </li>
                ))}
              </ul>
              {suggestion.bahanInfo && (
                <p className="mt-2 text-sm text-gray-600 italic">
                  {suggestion.bahanInfo}
                </p>
              )}
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-2 text-gray-800">
                Langkah Pembuatan
              </h4>
              <ol className="list-decimal pl-5 space-y-2">
                {suggestion.langkah.map((step, index) => (
                  <li key={index} className="text-gray-700">
                    {step}
                  </li>
                ))}
              </ol>
              {suggestion.tingkatKesulitanInfo && (
                <p className="mt-2 text-sm text-gray-600 italic">
                  {suggestion.tingkatKesulitanInfo}
                </p>
              )}
            </div>

            {/* Move detected objects section to bottom and make it less prominent */}
            <div className="mt-6 p-3 bg-gray-50 rounded-lg border-t">
              <h5 className="text-sm font-medium mb-2 text-gray-600">
                Objek Terdeteksi
              </h5>
              <div className="flex flex-wrap gap-1">
                {result.detectedObjects.map((obj, index) => (
                  <span
                    key={index}
                    className="inline-block bg-gray-200 px-2 py-1 text-xs rounded-md text-gray-600"
                    title={`Confidence: ${Math.round(obj.enhanced * 100)}%`}
                  >
                    {obj.class}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 text-right">
              <p className="text-xs text-gray-500">
                Rekomendasi dibuat dengan{" "}
                {suggestion.aiSource === "gemini"
                  ? "Google Gemini AI"
                  : suggestion.aiSource}
              </p>
            </div>
          </div>
        </div>

        {/* Tombol Download - Di luar konten PDF */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={downloadAsPDF}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2 transition-colors shadow-lg"
            title="Download panduan sebagai PDF"
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
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default CraftResult;
