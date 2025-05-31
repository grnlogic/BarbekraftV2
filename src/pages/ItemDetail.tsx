import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { itemsAPI } from "../services/api";
import { motion } from "framer-motion";

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
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="rounded-full h-12 w-12 border-t-2 border-b-2"
          style={{ borderTopColor: "#99d98c", borderBottomColor: "#99d98c" }}
        ></motion.div>
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
            className="mt-3 font-bold py-2 px-4 rounded"
            style={{
              backgroundColor: "rgba(217, 237, 146, 0.3)",
              color: "#99d98c",
            }}
            onClick={() => navigate("/items")}
          >
            Back to Items
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 min-h-screen"
      style={{
        background:
          "linear-gradient(to bottom, rgba(217, 237, 146, 0.2), rgba(255, 255, 255, 1))",
      }}
    >
      <motion.button
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        whileHover={{ x: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/items")}
        className="mb-6 bg-white hover:bg-gray-100 font-bold py-2 px-4 rounded-lg inline-flex items-center shadow-sm transition duration-300 hover:translate-x-1"
        style={{ color: "#6b8e23" }}
      >
        <span>← Back to Items</span>
      </motion.button>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
      >
        <div className="md:flex">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="md:w-1/2"
          >
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
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="md:w-1/2 p-8"
          >
            <h1 className="text-3xl font-bold mb-4 text-gray-800">
              {item.title}
            </h1>

            <div className="flex items-center mb-4">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="text-sm px-3 py-1 rounded-full mr-3"
                style={{
                  backgroundColor: "rgba(217, 237, 146, 0.3)",
                  color: "#6b8e23",
                }}
              >
                {item.condition}
              </motion.span>
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="text-sm px-3 py-1 rounded-full"
                style={{
                  backgroundColor: "rgba(153, 217, 140, 0.3)",
                  color: "#6b8e23",
                }}
              >
                {item.category}
              </motion.span>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-gray-800 mb-6 whitespace-pre-line leading-relaxed"
            >
              {item.description}
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mb-6 p-4 rounded-lg"
              style={{ backgroundColor: "rgba(217, 237, 146, 0.3)" }}
            >
              <h2
                className="text-xl font-semibold mb-2"
                style={{ color: "#6b8e23" }}
              >
                Ide Daur Ulang:
              </h2>
              {item.recyclingIdeas && item.recyclingIdeas.length > 0 ? (
                <motion.ul
                  className="list-disc list-inside text-gray-800 space-y-1"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1,
                      },
                    },
                  }}
                  initial="hidden"
                  animate="show"
                >
                  {item.recyclingIdeas.map((idea, index) => (
                    <motion.li
                      key={index}
                      variants={{
                        hidden: { opacity: 0, x: -10 },
                        show: { opacity: 1, x: 0 },
                      }}
                    >
                      {idea}
                    </motion.li>
                  ))}
                </motion.ul>
              ) : (
                <p className="text-gray-600 italic">
                  Belum ada ide daur ulang.
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="border-t border-gray-200 pt-4"
            >
              <p className="text-gray-700">
                Diposting oleh:{" "}
                <span className="font-semibold" style={{ color: "#6b8e23" }}>
                  {item.owner?.name || "Anonymous"}
                </span>
              </p>
              <p className="text-gray-700">
                Tanggal:{" "}
                {new Date(item.createdAt).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ItemDetail;
