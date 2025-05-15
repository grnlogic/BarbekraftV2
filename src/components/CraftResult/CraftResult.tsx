import React from "react";
import { SuggestionResponse } from "../../types";

interface CraftResultProps {
  result: SuggestionResponse;
}

const CraftResult: React.FC<CraftResultProps> = ({ result }) => {
  if (!result || !result.suggestion) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-green-600 text-white py-4 px-6">
        <h3 className="text-2xl font-bold">{result.suggestion.nama}</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="inline-block bg-green-700 px-2 py-1 text-xs rounded-md">
            {result.suggestion.kategori}
          </span>
          <span className="inline-block bg-green-700 px-2 py-1 text-xs rounded-md">
            {result.suggestion.tingkatKesulitan}
          </span>
          <span className="inline-block bg-green-700 px-2 py-1 text-xs rounded-md">
            {result.suggestion.estimasiWaktu}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-2 text-gray-800">
            Bahan-bahan
          </h4>
          <ul className="list-disc pl-5 space-y-1">
            {result.suggestion.bahan.map((item, index) => (
              <li key={index} className="text-gray-700">
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-sm text-gray-600 italic">
            {result.suggestion.bahanInfo}
          </p>
        </div>

        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-2 text-gray-800">
            Langkah Pembuatan
          </h4>
          <ol className="list-decimal pl-5 space-y-2">
            {result.suggestion.langkah.map((step, index) => (
              <li key={index} className="text-gray-700">
                {step}
              </li>
            ))}
          </ol>
          <p className="mt-2 text-sm text-gray-600 italic">
            {result.suggestion.tingkatKesulitanInfo}
          </p>
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-md font-semibold mb-2 text-gray-800">
            Objek Terdeteksi
          </h4>
          <div className="flex flex-wrap gap-2">
            {result.detectedObjects.map((obj, index) => (
              <span
                key={index}
                className="inline-block bg-gray-200 px-2 py-1 text-xs rounded-md"
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
            {result.suggestion.aiSource === "gemini"
              ? "Google Gemini AI"
              : result.suggestion.aiSource}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CraftResult;
