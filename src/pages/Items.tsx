import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase, supabaseSecondary } from "../lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  youtubeAPI,
  YouTubeVideo as YouTubeVideoAPI,
} from "../services/youtubeAPI";

// Tambahkan interface untuk tutorial
interface Tutorial {
  id: number;
  id_tutorial: number;
  id_ide: number;
  langkah_langkah: string;
  url_video: string;
  judul?: string;
  bahan_dibutuhkan?: string;
  tingkat_kesulitan?: string;
}

// Tambahkan properti untuk tutorial
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
  type?: "regular" | "tutorial" | "youtube-tutorial"; // Update untuk mendukung youtube-tutorial
  videoUrl?: string; // URL video untuk tutorial
  bahanbahan?: string; // Bahan-bahan untuk tutorial
}

// Tambahkan interface untuk video YouTube yang akan ditampilkan
interface YouTubeItem extends Item {
  youtubeVideoId: string;
  channelTitle: string;
}

// Add missing interface
interface YouTubeVideo {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    channelTitle: string;
    thumbnails: {
      high?: { url: string };
      medium?: { url: string };
    };
  };
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

  // Tambahkan state untuk tutorial
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loadingTutorials, setLoadingTutorials] = useState<boolean>(true);
  const [errorTutorials, setErrorTutorials] = useState<string | null>(null);

  // Tambahkan state untuk video YouTube
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideoAPI[]>([]);
  const [loadingYoutube, setLoadingYoutube] = useState<boolean>(true);

  // Tambahkan state untuk modal video
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState("");

  useEffect(() => {
    // Fungsi untuk mengambil data item
    const fetchItems = async () => {
      try {
        setLoading(true);

        // Mengambil data dari tabel Post di Supabase
        const { data, error } = await supabase
          .from("Post")
          .select("*")
          .order("createdAt", { ascending: false });

        if (error) {
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
        setError("Gagal memuat data dari Supabase. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    // Fungsi baru untuk mengambil tutorial
    const fetchTutorials = async () => {
      try {
        setLoadingTutorials(true);

        // 1. Uji koneksi dasar dulu
        const { data: testConn, error: testConnError } = await supabaseSecondary
          .from("Tutorial")
          .select("id")
          .limit(1);

        if (testConnError) {
          throw new Error(`Koneksi gagal: ${testConnError.message}`);
        }

        // 2. Ambil data tutorial
        const { data, error } = await supabaseSecondary
          .from("Tutorial")
          .select("*")
          .limit(5);

        if (error) {
          throw error;
        }

        // 3. Siapkan struktur data tutorial
        let tutorials: Tutorial[] = [];

        if (data && data.length > 0) {
          // Kumpulkan semua ID IDE yang unik
          const ideIds = Array.from(
            new Set(data.map((t) => t.id_ide).filter(Boolean))
          );

          // 4. Ambil data IDE Kerajinan secara terpisah (jika ada ID)
          let ideData: { [key: string]: any } = {};

          if (ideIds.length > 0) {
            const { data: ideResult, error: ideError } = await supabaseSecondary
              .from("Ide_Kerajinan")
              .select("*")
              .in("id", ideIds);

            if (ideError) {
              // console.error("Error saat mengambil data Ide_Kerajinan:", ideError); // Removed
            } else if (ideResult) {
              // Buat map dari id ke data ide
              ideData = ideResult.reduce((acc, ide) => {
                acc[ide.id] = ide;
                return acc;
              }, {});
            }
          }

          // 5. Gabungkan data tutorial dengan ide kerajinan
          tutorials = data.map((tutorial) => {
            const ideInfo = tutorial.id_ide ? ideData[tutorial.id_ide] : null;

            return {
              id: tutorial.id,
              id_tutorial: tutorial.id_tutorial,
              id_ide: tutorial.id_ide,
              langkah_langkah: tutorial.langkah_langkah || "",
              url_video: tutorial.url_video || "",
              judul: ideInfo?.judul || "Tutorial Tanpa Judul",
              bahan_dibutuhkan:
                ideInfo?.bahan_dibutuhkan || "Tidak ada informasi bahan",
              tingkat_kesulitan: ideInfo?.tingkat_kesulitan || "Pemula",
            };
          });
        }

        setTutorials(tutorials);

        // Tambahkan tutorial ke dalam galeri utama
        setItems((prevItems) => {
          // Convert tutorial to Item format
          const tutorialItems: Item[] = tutorials.map((tutorial, index) => {
            const videoId = getYoutubeID(tutorial.url_video);
            return {
              id: `tutorial-${tutorial.id}`,
              title: tutorial.judul ?? "Tutorial Tanpa Judul",
              description:
                tutorial.langkah_langkah || "Tutorial daur ulang barang bekas",
              imageUrl: videoId
                ? `https://img.youtube.com/vi/${videoId}/0.jpg`
                : "https://via.placeholder.com/600x400?text=Tutorial",
              condition: tutorial.tingkat_kesulitan ?? "Pemula",
              createdAt: new Date().toISOString(),
              username: "Barbekraft",
              likes: 0,
              featured: index === 0, // Jadikan tutorial pertama sebagai featured
              cardType: "with-description",
              type: "tutorial", // Menandai ini adalah tutorial
              videoUrl: tutorial.url_video, // Tambahkan url video ke item
              bahanbahan: tutorial.bahan_dibutuhkan ?? "", // Pastikan string, bukan undefined
            };
          });

          return [...prevItems, ...tutorialItems];
        });
      } catch (err) {
        setErrorTutorials(
          "Gagal memuat data tutorial dari Supabase. Silakan coba lagi nanti."
        );
      } finally {
        setLoadingTutorials(false);
      }
    };

    // Tambahkan fungsi untuk mengambil video YouTube
    const fetchYouTubeVideos = async () => {
      try {
        setLoadingYoutube(true);

        // Cari video tutorial berdasarkan kategori barang bekas
        const categories = [
          "plastik",
          "kardus",
          "kaca",
          "kertas",
          "logam",
          "kain",
        ];
        const videos = await youtubeAPI.searchRecyclingTutorials(categories);

        setYoutubeVideos(videos);

        // Konversi video YouTube menjadi format Item untuk ditampilkan di galeri
        const youtubeItems: Item[] = videos.map((video, index) => ({
          id: `youtube-${video.id.videoId}`,
          title: video.snippet.title,
          description: video.snippet.description.substring(0, 200) + "...",
          imageUrl:
            video.snippet.thumbnails.high?.url ||
            video.snippet.thumbnails.medium?.url,
          condition: "Tutorial YouTube",
          createdAt: video.snippet.publishedAt,
          username: video.snippet.channelTitle,
          likes: Math.floor(Math.random() * 50) + 10,
          featured: index === 0,
          cardType: "with-description",
          type: "youtube-tutorial" as const, // Explicit typing
          videoUrl: youtubeAPI.getVideoURL(video.id.videoId),
          bahanbahan: "Lihat deskripsi video",
        }));

        // Tambahkan video YouTube ke items
        setItems((prevItems) => [...prevItems, ...youtubeItems]);
      } catch (error) {
        console.error("Error fetching YouTube videos:", error);
      } finally {
        setLoadingYoutube(false);
      }
    };

    fetchItems();
    fetchTutorials();
    fetchYouTubeVideos(); // Panggil fungsi YouTube
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

  // Fungsi untuk membuka modal video
  const openVideoModal = (videoUrl: string) => {
    let videoId = "";

    if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
      videoId = getYoutubeID(videoUrl);
    } else {
      videoId = getYoutubeID(videoUrl);
    }

    if (videoId) {
      setCurrentVideoId(videoId);
      setVideoModalOpen(true);
      document.body.style.overflow = "hidden";
    }
  };

  // Fungsi untuk mengekstrak ID video dari URL YouTube
  const getYoutubeID = (url: string) => {
    if (!url) return "";

    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : "";
  };

  // Fungsi untuk menampilkan kartu tutorial
  const renderTutorialCard = (tutorial: Tutorial) => {
    const videoId = getYoutubeID(tutorial.url_video);

    return (
      <motion.div
        key={tutorial.id}
        whileHover={{
          backgroundColor: "rgba(239, 246, 255, 0.9)",
          x: 2,
        }}
        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors duration-200"
        onClick={() => (videoId ? openVideoModal(tutorial.url_video) : null)}
      >
        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-blue-100 flex items-center justify-center relative">
          {videoId ? (
            <>
              <img
                src={`https://img.youtube.com/vi/${videoId}/0.jpg`}
                alt={tutorial.judul}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/100?text=Tutorial";
                }}
              />
              {/* Overlay play button */}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </>
          ) : (
            <svg
              className="w-8 h-8 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-800 truncate flex items-center">
            {tutorial.judul}
            {videoId && (
              <svg
                className="w-4 h-4 ml-1 text-red-500"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
              </svg>
            )}
          </h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
            {tutorial.langkah_langkah
              ? tutorial.langkah_langkah.substring(0, 60) + "..."
              : "Lihat tutorial lengkap"}
          </p>
          <div className="flex items-center mt-1">
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
              {tutorial.tingkat_kesulitan}
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
          style={{ borderTopColor: "#99d98c", borderBottomColor: "#99d98c" }}
        ></div>
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
  const renderCard = (item: Item, index: number) => {
    // Jika item adalah video YouTube, gunakan renderer khusus
    if (item.type === "youtube-tutorial") {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ scale: 1.03 }}
          className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl h-full flex flex-col border-2 border-red-100"
          onClick={() => item.videoUrl && openVideoModal(item.videoUrl)}
        >
          <div className="relative aspect-video overflow-hidden">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/600x400?text=Video+Tutorial";
              }}
            />
            {/* Overlay YouTube play button */}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <svg
                className="w-16 h-16 text-red-500 drop-shadow-lg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
              </svg>
            </div>
            <div className="absolute top-2 right-2">
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                <svg
                  className="w-3 h-3 mr-1"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                </svg>
                YouTube
              </span>
            </div>
          </div>
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="font-semibold mb-2 text-gray-800 group-hover:text-red-600 line-clamp-2">
              {item.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">
              {item.description}
            </p>
            <div className="flex justify-between items-center">
              <span className="bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full">
                {item.condition}
              </span>
              <span className="text-xs text-gray-500">{item.username}</span>
            </div>
          </div>
        </motion.div>
      );
    }

    // Cek apakah item adalah tutorial
    if (item.type === "tutorial") {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ scale: 1.03 }}
          className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl h-full flex flex-col"
          onClick={() =>
            item.videoUrl ? openVideoModal(item.videoUrl) : openModal(item)
          }
        >
          <div className="relative aspect-video overflow-hidden">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/600x400?text=Tutorial+Video";
              }}
            />
            {/* Overlay play button untuk tutorial video */}
            {item.videoUrl && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-white opacity-80"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            )}
            <div className="absolute top-2 right-2">
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                Tutorial
              </span>
            </div>
          </div>
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="font-semibold mb-2 text-gray-800 group-hover:text-blue-600 line-clamp-2">
              {item.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">
              {item.description}
            </p>
            <div className="flex justify-between items-center">
              <span className="bg-blue-500/30 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                {item.condition}
              </span>
              {item.bahanbahan && (
                <span className="text-xs text-gray-500">
                  Bahan: {item.bahanbahan.split(",")[0]}...
                </span>
              )}
            </div>
          </div>
        </motion.div>
      );
    }

    // Kode untuk item normal yang sudah ada
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: index * 0.1,
          ease: "easeOut",
        }}
        whileHover={{
          scale: 1.03,
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
        }}
        className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col"
        onClick={() => openModal(item)}
        layout
      >
        <div className="aspect-square overflow-hidden">
          <motion.img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src =
                "https://via.placeholder.com/600x400?text=Tidak+Ada+Gambar";
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
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
            >
              {item.condition}
            </motion.span>
            <span className="text-xs text-gray-500">
              {new Date(item.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
              })}
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  // Render versi kartu yang lebih kecil untuk sidebar
  const renderSidebarCard = (item: Item) => {
    const isYouTube = item.type === "youtube-tutorial";

    return (
      <motion.div
        key={item.id}
        whileHover={{
          backgroundColor: isYouTube
            ? "rgba(254, 226, 226, 0.9)"
            : "rgba(239, 246, 255, 0.9)",
          x: 2,
        }}
        className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
          isYouTube ? "hover:bg-red-50" : "hover:bg-blue-50"
        }`}
        onClick={() =>
          isYouTube && item.videoUrl
            ? openVideoModal(item.videoUrl)
            : openModal(item)
        }
      >
        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 relative">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = isYouTube
                ? "https://via.placeholder.com/100?text=YouTube"
                : "https://via.placeholder.com/100?text=Tidak+Ada+Gambar";
            }}
          />
          {isYouTube && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-red-500"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-800 truncate flex items-center">
            {item.title}
            {isYouTube && (
              <svg
                className="w-3 h-3 ml-1 text-red-500"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
              </svg>
            )}
          </h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
            {item.description}
          </p>
          <div className="flex items-center mt-1">
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                isYouTube ? "bg-red-100 text-red-800" : "text-red-500"
              }`}
            >
              {isYouTube ? "YouTube" : `❤️ ${item.likes || 0}`}
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  const filters = [
    { id: "all", name: "Semua" },
    { id: "Baik", name: "Kondisi Baik" },
    { id: "Sangat Baik", name: "Sangat Baik" },
    { id: "Layak Pakai", name: "Layak Pakai" },
    { id: "Tutorial", name: "Tutorial" },
    { id: "YouTube", name: "Video YouTube" }, // Tambahkan filter YouTube
  ];

  // Modifikasi fungsi filter
  const filteredItems = items.filter(
    (item) =>
      (activeFilter === "all"
        ? true
        : activeFilter === "Tutorial"
        ? item.type === "tutorial"
        : activeFilter === "YouTube"
        ? item.type === "youtube-tutorial"
        : item.type !== "tutorial" &&
          item.type !== "youtube-tutorial" &&
          item.condition === activeFilter) &&
      (searchTerm === ""
        ? true
        : item.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div
      className="container mx-auto px-4 py-8 min-h-screen"
      style={{
        background:
          "linear-gradient(to bottom, rgba(59, 130, 246, 0.1), rgba(255, 255, 255, 1))",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2" style={{ color: "#6b8e23" }}>
          Galeri Barang Bekas
        </h1>
        <p className="text-gray-700">
          Jelajahi barang bekas yang bisa diubah menjadi barang bernilai
        </p>
      </motion.div>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-xl shadow-sm text-center"
        >
          <svg
            className="w-16 h-16 mx-auto mb-4"
            style={{ color: "#99d98c" }}
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
        </motion.div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Konten Utama - Sisi Kiri */}
          <div className="w-full lg:w-9/12">
            <motion.div layout className="flex flex-wrap gap-2 mb-6">
              {filters.map((filter) => (
                <motion.button
                  key={filter.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                    activeFilter === filter.id
                      ? "text-white"
                      : "bg-white text-gray-800 hover:text-white border border-gray-200"
                  }`}
                  style={{
                    backgroundColor:
                      activeFilter === filter.id ? "#99d98c" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (activeFilter !== filter.id) {
                      e.currentTarget.style.backgroundColor =
                        "rgba(153, 217, 140, 0.1)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeFilter !== filter.id) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  {filter.name}
                </motion.button>
              ))}
            </motion.div>

            <motion.div layout className="grid grid-cols-12 gap-4">
              <AnimatePresence>
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5 }}
                    className="col-span-12 sm:col-span-6 lg:col-span-4"
                  >
                    {renderCard(item, index)}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Sidebar - Sisi Kanan */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="w-full lg:w-3/12"
          >
            <div className="sticky top-20 space-y-6">
              {/* Kotak Pencarian */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white rounded-xl shadow-sm p-4 border"
                style={{ borderColor: "#d9ed92" }}
              >
                <h3
                  className="text-lg font-semibold mb-3"
                  style={{ color: "#6b8e23" }}
                >
                  Cari Barang
                </h3>
                <div className="relative">
                  <motion.input
                    initial={{ boxShadow: "0 0 0 rgba(153, 217, 140, 0)" }}
                    whileFocus={{
                      boxShadow: "0 0 0 3px rgba(153, 217, 140, 0.3)",
                    }}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari barang bekas..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:outline-none"
                    style={{ borderColor: "#d9ed92" }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#99d98c";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#d9ed92";
                    }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                    style={
                      { "--hover-color": "#99d98c" } as React.CSSProperties
                    }
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#99d98c";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#6b7280";
                    }}
                  >
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
                  </motion.button>
                </div>
              </motion.div>

              {/* Item Populer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white rounded-xl shadow-sm p-4"
              >
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  Populer
                </h3>
                <motion.div
                  className="space-y-2"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1,
                      },
                    },
                  }}
                  initial="hidden"
                  animate="visible"
                >
                  {popularItems.map((item) => renderSidebarCard(item))}
                </motion.div>
              </motion.div>

              {/* Tutorial Section - NEW */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-white rounded-xl shadow-sm p-4"
              >
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  Tutorial Daur Ulang
                </h3>

                {loadingTutorials ? (
                  <div className="flex justify-center items-center h-24">
                    <div
                      className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2"
                      style={{
                        borderTopColor: "#99d98c",
                        borderBottomColor: "#99d98c",
                      }}
                    ></div>
                  </div>
                ) : errorTutorials ? (
                  <div className="text-sm text-red-500 p-3">
                    {errorTutorials}
                  </div>
                ) : tutorials.length === 0 ? (
                  <div className="text-sm text-gray-500 p-3 text-center">
                    Belum ada tutorial tersedia.
                  </div>
                ) : (
                  <motion.div
                    className="space-y-2"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.1,
                        },
                      },
                    }}
                    initial="hidden"
                    animate="visible"
                  >
                    {tutorials.map((tutorial) => renderTutorialCard(tutorial))}

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="mt-3 text-center"
                    >
                      <Link
                        to="/tutorials"
                        className="text-sm font-medium hover:underline"
                        style={{ color: "#99d98c" }}
                      >
                        Lihat Semua Tutorial →
                      </Link>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>

              {/* Video YouTube Section - NEW */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-white rounded-xl shadow-sm p-4 border-2"
                style={{ borderColor: "rgba(217, 237, 146, 0.5)" }}
              >
                <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-red-500"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                  </svg>
                  Video Tutorial YouTube
                </h3>

                {loadingYoutube ? (
                  <div className="flex justify-center items-center h-24">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
                  </div>
                ) : youtubeVideos.length === 0 ? (
                  <div className="text-sm text-gray-500 p-3 text-center">
                    Belum ada video tutorial YouTube tersedia.
                  </div>
                ) : (
                  <motion.div
                    className="space-y-2"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.1,
                        },
                      },
                    }}
                    initial="hidden"
                    animate="visible"
                  >
                    {youtubeVideos.slice(0, 3).map((video) => {
                      const item: Item = {
                        id: `youtube-${video.id.videoId}`,
                        title: video.snippet.title,
                        description:
                          video.snippet.description.substring(0, 80) + "...",
                        imageUrl: video.snippet.thumbnails.medium?.url || "",
                        condition: "YouTube",
                        createdAt: video.snippet.publishedAt,
                        username: video.snippet.channelTitle,
                        type: "youtube-tutorial" as const, // Explicit typing
                        videoUrl: youtubeAPI.getVideoURL(video.id.videoId),
                      };
                      return renderSidebarCard(item);
                    })}

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="mt-3 text-center"
                    >
                      <button
                        onClick={() => setActiveFilter("YouTube")}
                        className="text-red-600 text-sm font-medium hover:underline"
                      >
                        Lihat Semua Video YouTube →
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>

              {/* Kotak Bantuan */}
              <div
                className="rounded-xl shadow-sm p-5 text-white"
                style={{
                  background: "linear-gradient(to right, #99d98c, #d9ed92)",
                }}
              >
                <h3 className="text-lg font-semibold mb-2">
                  Punya Barang Bekas?
                </h3>
                <p className="text-green-100 text-sm mb-4">
                  Gunakan aplikasi kami untuk mendapatkan ide daur ulang
                  kreatif.
                </p>
                <button className="bg-white text-green-700 transition-colors duration-200 px-4 py-2 rounded-lg text-sm font-medium w-full hover:bg-green-50">
                  Mulai Sekarang
                </button>
              </div>

              {/* Tag/Kategori */}
              <div
                className="bg-white rounded-xl shadow-sm p-4 border"
                style={{ borderColor: "#d9ed92" }}
              >
                <h3
                  className="text-lg font-semibold mb-3"
                  style={{ color: "#6b8e23" }}
                >
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
                      className="px-3 py-1 text-sm cursor-pointer hover:shadow-md transition-all duration-200 rounded-full"
                      style={{
                        backgroundColor: "rgba(217, 237, 146, 0.3)",
                        color: "#6b8e23",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "rgba(153, 217, 140, 0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "rgba(217, 237, 146, 0.3)";
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal Bergaya Instagram */}
      <AnimatePresence>
        {showModal && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
            onClick={handleOutsideClick}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
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
                  <h2 className="text-xl font-bold mb-2">
                    {selectedItem.title}
                  </h2>
                  <p className="text-gray-700 mb-4">
                    {selectedItem.description}
                  </p>

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
                    className="w-full text-white font-medium py-2 px-4 rounded text-center block"
                    style={{
                      background: "linear-gradient(to right, #99d98c, #d9ed92)",
                    }}
                  >
                    Lihat Detail Barang
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Video YouTube */}
      <AnimatePresence>
        {videoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
            onClick={() => setVideoModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-lg overflow-hidden max-w-4xl w-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
                <button
                  className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75"
                  onClick={() => setVideoModalOpen(false)}
                >
                  <svg
                    className="w-6 h-6"
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Items;
