import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { itemsAPI } from "../services/api";

interface Item {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  condition: string;
  category: string;
  owner: {
    id: string;
    name: string;
  };
  createdAt: string;
  recyclingIdeas: string[];
}

const ItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;

      try {
        const response = await itemsAPI.getItemById(id);
        setItem(response.data);
      } catch (err) {
        console.error("Failed to fetch item:", err);
        setError("Failed to load item details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative"
          role="alert"
        >
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error || "Item not found"}</span>
          <button
            className="mt-3 bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold py-2 px-4 rounded"
            onClick={() => navigate("/items")}
          >
            Back to Items
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <button
        onClick={() => navigate("/items")}
        className="mb-6 bg-white hover:bg-gray-100 text-blue-700 font-bold py-2 px-4 rounded-lg inline-flex items-center shadow-sm transition duration-300 hover:translate-x-1"
      >
        <span>← Back to Items</span>
      </button>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src =
                  "https://via.placeholder.com/600x400?text=No+Image";
              }}
            />
          </div>

          <div className="md:w-1/2 p-8">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">
              {item.title}
            </h1>

            <div className="flex items-center mb-4">
              <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mr-3">
                {item.condition}
              </span>
              <span className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full">
                {item.category}
              </span>
            </div>

            <p className="text-gray-700 mb-6 whitespace-pre-line leading-relaxed">
              {item.description}
            </p>

            <div className="mb-6 bg-blue-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-2 text-blue-900">
                Ide Daur Ulang:
              </h2>
              {item.recyclingIdeas && item.recyclingIdeas.length > 0 ? (
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {item.recyclingIdeas.map((idea, index) => (
                    <li key={index}>{idea}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">
                  Belum ada ide daur ulang.
                </p>
              )}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <p className="text-gray-600">
                Diposting oleh:{" "}
                <span className="font-semibold text-blue-700">
                  {item.owner?.name || "Anonymous"}
                </span>
              </p>
              <p className="text-gray-600">
                Tanggal:{" "}
                {new Date(item.createdAt).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
