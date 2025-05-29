import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ImageUploader from "../components/ImageUploader";
import CraftResult from "../components/CraftResult";
import InstagramShare from "../components/InstagramShare/InstagramShare";
import { SuggestionResponse } from "../types";
import { motion } from "framer-motion";
import Logo from "../images/Logo.png";

const Home: React.FC = () => {
  const [result, setResult] = useState<SuggestionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showUploader, setShowUploader] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState(false);
  const [showInstagramModal, setShowInstagramModal] = useState(false);

  // Handle scroll effect for enhanced UI
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleProcessingComplete = (suggestion: SuggestionResponse) => {
    setResult(suggestion);
    setError(null);
    setTimeout(() => {
      document
        .getElementById("result-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleError = (error: Error) => {
    setError(error.message);
    setResult(null);
  };

  const startNewAnalysis = () => {
    setResult(null);
    setError(null);
    setShowUploader(true);
    setTimeout(() => {
      document
        .getElementById("upload-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section - Modern Redesign */}
      <div className="relative overflow-hidden py-20 lg:py-32">
        {/* Background elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-blue-400 to-teal-400 rounded-full opacity-10 blur-3xl"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="lg:w-1/2"
            >
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                Daur Ulang Secara Kreatif
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Ubah barang bekas Anda menjadi kreasi berharga bersama kami
                Platform bertenaga AI. Kurangi pemborosan, percikkan
                kreativitas, dan buat perbedaan.
              </p>

              <div className="flex flex-wrap gap-5 mb-8">
                <Link
                  to="/items"
                  className="px-8 py-4 border-2 border-indigo-600 text-indigo-600 font-medium rounded-full hover:bg-indigo-50 transition-all duration-300"
                >
                  Telusuri Barang Bekas
                </Link>

                <button
                  onClick={() => setShowInstagramModal(true)}
                  className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-full hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300 flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  Share ke Instagram
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:w-1/2 relative"
            >
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl rotate-3 opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl -rotate-3 opacity-10"></div>
                <img
                  src="/images/hero-image.jpg"
                  alt="Recycling illustration"
                  className="relative z-10 w-full h-full object-cover rounded-2xl shadow-xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = Logo;
                  }}
                />
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-yellow-400 rounded-full opacity-20 blur-xl"></div>
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-purple-500 rounded-full opacity-20 blur-xl"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Analysis Section - Side by Side Modern Design */}
      <div className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-slate-800">
              AI-Powered Recycling Analysis
            </h2>
            <p className="text-slate-600">
              Unggah foto barang bekas Anda dan dapatkan daur ulang kreatif
              saran secara instan
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* Upload Section */}
              <div
                id="upload-section"
                className="w-full lg:w-1/2 p-8 border-b lg:border-b-0 lg:border-r border-slate-100"
              >
                <div className="mb-5">
                  <h3 className="text-xl font-semibold mb-3 text-slate-800">
                    Upload
                  </h3>
                  <p className="text-slate-500 mb-6">
                    Ambil foto yang jelas dari item Anda untuk mendapatkan
                    analisis terbaik hasil
                  </p>

                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl">
                    <ImageUploader
                      onProcessingComplete={handleProcessingComplete}
                      onError={handleError}
                    />
                  </div>

                  {error && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                      <h3 className="font-semibold mb-1">Error</h3>
                      <p>{error}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Results Section */}
              <div
                id="result-section"
                className="w-full lg:w-1/2 p-8 bg-gradient-to-br from-slate-50 to-blue-50"
              >
                <h3 className="text-xl font-semibold mb-3 text-slate-800">
                  {result
                    ? "Your Recycling Suggestions"
                    : "Recycling Ideas Will Appear Here"}
                </h3>

                {result ? (
                  <div className="space-y-6">
                    <CraftResult result={result} />
                    <div className="text-center mt-8">
                      <button
                        onClick={startNewAnalysis}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-medium rounded-full hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
                      >
                        Analyze Another Item
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-slate-400 bg-white bg-opacity-50 rounded-xl">
                    <svg
                      className="w-16 h-16 mb-4 text-indigo-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p>Upload an image to see AI-generated recycling ideas</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it works section - Modern Cards */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm font-medium mb-4">
              Bagaimana Cara Kerjanya
            </span>
            <h2 className="text-3xl font-bold mb-4 text-slate-800">
              Ubah Barang Bekas Anda Menjadi Karya Seni
            </h2>
            <p className="text-slate-600">
              Platform bertenaga AI kami memudahkan untuk menemukan cara kreatif
              untuk mendaur ulang
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {[
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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
                ),
                title: "Take a Photo",
                description:
                  "Capture a clear photo of the item you want to recycle or repurpose",
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                ),
                title: "Get Smart Suggestions",
                description:
                  "Our AI analyzes your item and provides creative recycling ideas",
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                ),
                title: "Create & Share",
                description:
                  "Follow our guides to transform your items and inspire others",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center text-white mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-800">
                  {step.title}
                </h3>
                <p className="text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular recycling ideas - Gallery Design */}
      <div className="py-20 bg-gradient-to-br from-indigo-50 to-sky-50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm font-medium mb-4">
              Trending Ideas
            </span>
            <h2 className="text-3xl font-bold mb-4 text-slate-800">
              Barang Rekomendasi untuk Daur Ulang
            </h2>
            <p className="text-slate-600">
              Dapatkan inspirasi dari cara kreatif ini untuk mendaur ulang
              barang sehari-hari
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                image:
                  "https://images.pexels.com/photos/802221/pexels-photo-802221.jpeg?auto=compress&cs=tinysrgb&w=600",
                title: "Plastic Bottle Planters",
                description:
                  "Turn empty plastic bottles into beautiful hanging planters",
                difficulty: "Easy",
              },
              {
                image:
                  "https://images.pexels.com/photos/4946819/pexels-photo-4946819.jpeg?auto=compress&cs=tinysrgb&w=600",
                title: "Wood Pallet Shelves",
                description:
                  "Convert old wooden pallets into rustic wall shelves",
                difficulty: "Medium",
              },
              {
                image:
                  "https://images.pexels.com/photos/3640648/pexels-photo-3640648.jpeg?auto=compress&cs=tinysrgb&w=600",
                title: "Glass Jar Lights",
                description:
                  "Membuat lampu mempesona dari stoples dan botol kaca bekas",
                difficulty: "Mudah",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 z-20">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs">
                      {item.difficulty}
                    </span>
                  </div>
                  <p className="text-white/80 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.description}
                  </p>
                  <button className="px-4 py-2 bg-white text-indigo-600 rounded-full text-sm font-medium transform -translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    Lihat Tutorial
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/items"
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-medium rounded-full hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 inline-flex items-center"
            >
              <span>Jelajahi Semua Ide</span>
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Tambahkan setelah bagian "How it works" */}
      <div className="py-16 bg-gradient-to-br from-slate-100 to-blue-100">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm font-medium mb-4">
              Data Sampah Indonesia
            </span>
            <h2 className="text-3xl font-bold mb-4 text-slate-800">
              Mengapa Daur Ulang Itu Penting?
            </h2>
            <p className="text-slate-600 mb-6">
              40,17% sampah di Indonesia masih tidak terkelola. Mari jadilah
              bagian dari solusi!
            </p>

            <div className="flex justify-center">
              <Link
                to="/waste-statistics"
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-medium rounded-full hover:shadow-lg transition-all duration-300"
              >
                Lihat Data Statistik Lengkap
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Preview Chart Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 text-center">
                  Status Pengelolaan Sampah 2024
                </h3>
                <div className="flex gap-2 justify-center mb-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full mr-1"></div>
                    <span className="text-sm">Terkelola (59.83%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                    <span className="text-sm">Tidak Terkelola (40.17%)</span>
                  </div>
                </div>
                <div className="h-[200px] relative">
                  {/* Ini hanya placeholder, chart sebenarnya akan tampil di halaman statistik */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-32 h-32">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="10"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="10"
                        strokeDasharray="251.2"
                        strokeDashoffset="100.5"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Card */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 rounded-xl shadow-lg text-white flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-4">
                40.17% Sampah Masih Tidak Terkelola
              </h3>
              <p className="mb-6">
                Mari jadi bagian dari solusi dengan mendaur ulang barang-barang
                bekas secara kreatif
              </p>
              <button
                onClick={startNewAnalysis}
                className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-full hover:shadow-lg transition-all duration-300 self-start"
              >
                Mulai Daur Ulang Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ajakan Bertindak - Moved just above testimonial section */}
      <div className="py-20 bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Siap Memulai Perjalanan Daur Ulang Anda?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Bergabunglah dengan komunitas kreator peduli lingkungan kami dan
            ubah limbah Anda menjadi kreasi indah.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://kraftzy.vercel.app/login"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white text-indigo-600 font-medium rounded-full hover:shadow-lg hover:shadow-indigo-700/30 transition-all duration-300"
            >
              Mulai Sekarang
            </a>
            <Link
              to="/items"
              className="px-8 py-4 border-2 border-white text-white font-medium rounded-full hover:bg-white/10 transition-all duration-300"
            >
              Jelajahi Galeri
            </Link>
          </div>
        </div>
      </div>

      {/* Testimoni Carousel - Desain Modern */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm font-medium mb-4">
              Testimoni
            </span>
            <h2 className="text-3xl font-bold mb-4 text-slate-800">
              Apa Kata Komunitas Kami
            </h2>
            <p className="text-slate-600">
              Bergabunglah dengan ribuan kreator peduli lingkungan yang telah
              membuat perubahan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 mb-4">
                "Saya mengubah jeans lama menjadi tas jinjing yang indah
                mengikuti saran AI. Sangat mudah dan praktis!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold">Siti Nurhaliza</p>
                  <div className="flex text-yellow-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 mb-4">
                "AI dengan akurat mengidentifikasi kursi rusak saya dan
                memberikan 3 cara berbeda untuk menggunakannya kembali. Saya
                kagum!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold">Bambang Sutrisno</p>
                  <div className="flex text-yellow-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 mb-4">
                "Sebagai guru, saya menggunakan ini dengan siswa saya untuk
                mengajarkan mereka tentang keberlanjutan dengan cara praktis.
                Mereka menyukainya!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold">Dewi Kartika</p>
                  <div className="flex text-yellow-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button className="h-2 w-2 rounded-full bg-blue-600 mx-1"></button>
            <button className="h-2 w-2 rounded-full bg-blue-300 mx-1"></button>
            <button className="h-2 w-2 rounded-full bg-blue-300 mx-1"></button>
          </div>
        </div>
      </div>

      {/* Instagram Share Modal */}
      {showInstagramModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowInstagramModal(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-600"
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

            {result ? (
              <InstagramShare result={result} />
            ) : (
              <div className="p-8 text-center">
                <div className="mb-6">
                  <svg
                    className="w-16 h-16 mx-auto text-gray-300 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    Belum Ada Hasil Analisis
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Upload foto barang bekas Anda terlebih dahulu untuk
                    mendapatkan saran daur ulang, kemudian Anda bisa
                    membagikannya ke Instagram.
                  </p>
                  <button
                    onClick={() => {
                      setShowInstagramModal(false);
                      setTimeout(() => {
                        document
                          .getElementById("upload-section")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }, 100);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-medium rounded-full hover:shadow-lg transition-all duration-300"
                  >
                    Upload Foto Sekarang
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
