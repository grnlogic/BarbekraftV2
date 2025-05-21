import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase"; // Impor supabase client

// Perbarui interface Item sesuai dengan struktur tabel Post di Supabase
interface Item {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  condition: string;
  createdAt: string;
  username?: string;
  likes?: number;
  featured?: boolean;
  cardType?: "image-only" | "with-description" | "large-feature";
}

const Items: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [popularItems, setPopularItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);

        // Mengambil data dari tabel Post di Supabase
        const { data, error } = await supabase
          .from("Post")
          .select("*")
          .order("createdAt", { ascending: false });

        if (error) {
          console.error("Error details:", error);
          throw error;
        }

        if (data) {
          // Memetakan data dari Supabase ke format yang digunakan aplikasi
          const mappedItems: Item[] = data.map((post) => ({
            id: post.id.toString(),
            title: post.postText.substring(0, 50) || "Barang Bekas",
            description: post.postText || "Tidak ada deskripsi",
            imageUrl:
              post.media ||
              "https://dummyimage.com/600x400/cccccc/ffffff&text=Tidak+Ada+Gambar",
            condition: "Baik", // Default value, sesuaikan jika perlu
            createdAt: post.createdAt,
            username: post.authorId || "Pengguna",
            likes: 0, // Default likes to 0 instead of random
            featured: false,
            cardType: "image-only", // Simplified to just use image-only by default
          }));

          setItems(mappedItems);

          // Set item populer - 3 item teratas berdasarkan tanggal
          const sorted = [...mappedItems].slice(0, 3);
          setPopularItems(sorted);
        }
      } catch (err) {
        console.error("Gagal mengambil item:", err);
        setError("Gagal memuat data dari Supabase. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const openModal = (item: Item) => {
    setSelectedItem(item);
    setShowModal(true);
    // Mencegah scrolling ketika modal terbuka
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    // Aktifkan kembali scrolling
    document.body.style.overflow = "auto";
  };

  // Menangani klik di luar modal untuk menutupnya
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative"
        role="alert"
      >
        <strong className="font-bold">Kesalahan! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  // Fungsi bantuan untuk merender berbagai jenis kartu
  const renderCard = (item: Item) => {
    return (
      <div
        className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col"
        onClick={() => openModal(item)}
      >
        <div className="aspect-square overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src =
                "https://via.placeholder.com/300?text=Tidak+Ada+Gambar";
            }}
          />
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
            {item.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">
            {item.description}
          </p>
          <div className="flex justify-between items-center">
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {item.condition}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(item.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
              })}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Render versi kartu yang lebih kecil untuk sidebar
  const renderSidebarCard = (item: Item) => {
    return (
      <div
        key={item.id}
        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors duration-200"
        onClick={() => openModal(item)}
      >
        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src =
                "https://via.placeholder.com/100?text=Tidak+Ada+Gambar";
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-800 truncate">
            {item.title}
          </h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
            {item.description}
          </p>
          <div className="flex items-center mt-1">
            <span className="text-xs text-red-500 flex items-center">
              <svg
                className="w-3 h-3 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
              {item.likes || 0}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const filters = [
    { id: "all", name: "Semua" },
    { id: "Baik", name: "Kondisi Baik" },
    { id: "Sangat Baik", name: "Sangat Baik" },
    { id: "Layak Pakai", name: "Layak Pakai" },
    { id: "Tutorial", name: "Tutorial" },
  ];

  // Filter item berdasarkan filter yang dipilih
  const filteredItems = items.filter(
    (item) =>
      (activeFilter === "all" ? true : item.condition === activeFilter) &&
      (searchTerm === ""
        ? true
        : item.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-blue-900">
          Galeri Barang Bekas
        </h1>
        <p className="text-blue-700">
          Jelajahi barang bekas yang bisa diubah menjadi barang bernilai
        </p>
      </div>

      {items.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm text-center">
          <svg
            className="w-16 h-16 text-blue-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <p className="text-gray-600 text-lg">
            Belum ada barang bekas yang tersedia.
          </p>
          <p className="text-gray-500 mt-2">
            Kembali lagi nanti untuk melihat barang terbaru.
          </p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Konten Utama - Sisi Kiri */}
          <div className="w-full lg:w-9/12">
            <div className="flex flex-wrap gap-2 mb-6">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                    activeFilter === filter.id
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  {filter.name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-12 gap-4">
              {filteredItems.map((item, index) => {
                // Untuk item pertama, selalu jadikan featured jika belum
                if (index === 0 && !item.featured) {
                  return (
                    <div
                      key={item.id}
                      className="col-span-12 md:col-span-8 transition-all duration-300 hover:transform hover:scale-[1.01]"
                    >
                      <div
                        className="group cursor-pointer relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full"
                        onClick={() => openModal(item)}
                      >
                        <div className="aspect-video h-full">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src =
                                "https://via.placeholder.com/600x400?text=Tidak+Ada+Gambar";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-300"></div>

                          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-300 transition-colors">
                              {item.title}
                            </h3>
                            <p className="text-sm text-white/80 line-clamp-2">
                              {item.description}
                            </p>
                            <div className="flex items-center justify-between mt-4">
                              <span className="bg-blue-500/30 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                                {item.condition}
                              </span>
                              <div className="flex items-center space-x-1">
                                <svg
                                  className="w-4 h-4 text-red-500"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="text-xs">{item.likes}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                if (item.featured) {
                  return (
                    <div
                      key={item.id}
                      className="col-span-12 md:col-span-8 transition-all duration-300 hover:transform hover:scale-[1.01]"
                    >
                      {renderCard(item)}
                    </div>
                  );
                } else if (item.cardType === "with-description") {
                  return (
                    <div
                      key={item.id}
                      className="col-span-6 md:col-span-4 transition-all duration-300 hover:transform hover:scale-[1.01]"
                    >
                      {renderCard(item)}
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={item.id}
                      className="col-span-6 sm:col-span-4 md:col-span-4 transition-all duration-300 hover:transform hover:scale-[1.02]"
                    >
                      {renderCard(item)}
                    </div>
                  );
                }
              })}
            </div>
          </div>

          {/* Sidebar - Sisi Kanan */}
          <div className="w-full lg:w-3/12">
            <div className="sticky top-20 space-y-6">
              {/* Kotak Pencarian */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  Cari Barang
                </h3>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari barang bekas..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Item Populer */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  Populer
                </h3>
                <div className="space-y-2">
                  {popularItems.map((item) => renderSidebarCard(item))}
                </div>
              </div>

              {/* Kotak Bantuan */}
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-sm p-5 text-white">
                <h3 className="text-lg font-semibold mb-2">
                  Punya Barang Bekas?
                </h3>
                <p className="text-sm text-blue-100 mb-4">
                  Gunakan aplikasi kami untuk mendapatkan ide daur ulang
                  kreatif.
                </p>
                <button className="bg-white text-blue-600 hover:bg-blue-50 transition-colors duration-200 px-4 py-2 rounded-lg text-sm font-medium w-full">
                  Mulai Sekarang
                </button>
              </div>

              {/* Tag/Kategori */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  Kategori
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Plastik",
                    "Kaca",
                    "Kardus",
                    "Kertas",
                    "Logam",
                    "Kain",
                    "Kayu",
                    "Ban",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-full text-sm text-gray-700 transition-colors duration-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Bergaya Instagram */}
      {showModal && selectedItem && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={handleOutsideClick}
        >
          <div
            className="bg-white rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sisi kiri - Gambar */}
            <div className="md:w-1/2 bg-gray-100">
              <div className="relative w-full h-full min-h-[300px]">
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://via.placeholder.com/600?text=Tidak+Ada+Gambar";
                  }}
                />
              </div>
            </div>

            {/* Sisi kanan - Konten */}
            <div className="md:w-1/2 flex flex-col max-h-[90vh] md:max-h-full">
              {/* Header */}
              <div className="p-4 border-b flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  {selectedItem.username?.[0].toUpperCase() || "P"}
                </div>
                <div>
                  <p className="font-medium">
                    {selectedItem.username || "Pengguna"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedItem.condition}
                  </p>
                </div>
                <button
                  className="ml-auto text-gray-500 hover:text-gray-700"
                  onClick={closeModal}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
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

              {/* Konten */}
              <div className="p-4 overflow-y-auto flex-grow">
                <h2 className="text-xl font-bold mb-2">{selectedItem.title}</h2>
                <p className="text-gray-700 mb-4">{selectedItem.description}</p>

                <div className="mb-4">
                  <span className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full mr-2">
                    {selectedItem.condition}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {new Date(selectedItem.createdAt).toLocaleDateString(
                      "id-ID",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <button className="text-gray-700 hover:text-red-500">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                    <button className="text-gray-700 hover:text-blue-500">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </button>
                    <button className="text-gray-700 hover:text-blue-500">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        />
                      </svg>
                    </button>
                  </div>
                  <span className="text-sm font-medium">
                    {selectedItem.likes || 0} suka
                  </span>
                </div>

                <a
                  href="https://kraftzy.vercel.app/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded text-center block"
                >
                  Lihat Detail Barang
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Items;
