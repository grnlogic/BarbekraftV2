import React from "react";
import WasteDataChart from "../components/WasteDataChart";
import { Link } from "react-router-dom";

const WasteStatistics: React.FC = () => {
  // Data sampel untuk chart (gunakan data riil dari API/database di implementasi sebenarnya)
  const yearlyWasteData = [
    { time: "2018", value: 28500000 },
    { time: "2019", value: 29800000 },
    { time: "2020", value: 30900000 },
    { time: "2021", value: 31800000 },
    { time: "2022", value: 32750000 },
    { time: "2023", value: 33400000 },
    { time: "2024", value: 33980337.81 },
  ];

  const managedWasteData = [
    { time: "2018", value: 13600000 },
    { time: "2019", value: 15200000 },
    { time: "2020", value: 16400000 },
    { time: "2021", value: 17600000 },
    { time: "2022", value: 18900000 },
    { time: "2023", value: 19600000 },
    { time: "2024", value: 20331778.78 },
  ];

  const wasteReductionData = [
    { time: "2018", value: 2100000 },
    { time: "2019", value: 2600000 },
    { time: "2020", value: 3100000 },
    { time: "2021", value: 3500000 },
    { time: "2022", value: 3900000 },
    { time: "2023", value: 4200000 },
    { time: "2024", value: 4492716.51 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <header className="mb-12 text-center">
            <Link
              to="/"
              className="inline-flex items-center text-indigo-600 mb-6 hover:underline"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Kembali ke Beranda
            </Link>
            <h1 className="text-4xl font-bold mb-4 text-slate-800">
              Data Statistik Pengelolaan Sampah
            </h1>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Data berikut menampilkan capaian kinerja pengelolaan sampah dari
              315 Kabupaten/kota di Indonesia pada tahun 2024
            </p>
          </header>

          {/* Statistik Utama */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <h3 className="text-xl font-semibold mb-2 text-slate-800">
                Total Timbulan Sampah
              </h3>
              <p className="text-3xl font-bold text-orange-500">
                33.980.337,81
              </p>
              <p className="text-gray-500">ton/tahun</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <h3 className="text-xl font-semibold mb-2 text-slate-800">
                Sampah Terkelola
              </h3>
              <p className="text-3xl font-bold text-emerald-500">59,83%</p>
              <p className="text-gray-500">20.331.778,78 ton/tahun</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <h3 className="text-xl font-semibold mb-2 text-slate-800">
                Sampah Tidak Terkelola
              </h3>
              <p className="text-3xl font-bold text-red-500">40,17%</p>
              <p className="text-gray-500">13.648.559,03 ton/tahun</p>
            </div>
          </div>

          {/* Visualisasi Chart */}
          <div className="space-y-10">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 pb-2">
                <h3 className="text-xl font-semibold mb-2 text-slate-800">
                  Tren Timbulan Sampah Tahunan
                </h3>
                <p className="text-slate-500">
                  Peningkatan total timbulan sampah di Indonesia dari tahun ke
                  tahun
                </p>
              </div>
              <div className="p-4">
                <WasteDataChart
                  data={yearlyWasteData}
                  colors={{
                    backgroundColor: "white",
                    lineColor: "#f97316",
                    textColor: "#334155",
                    areaTopColor: "rgba(249, 115, 22, 0.4)",
                    areaBottomColor: "rgba(249, 115, 22, 0.05)",
                  }}
                  title="Timbulan Sampah (ton/tahun)"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 pb-2">
                <h3 className="text-xl font-semibold mb-2 text-slate-800">
                  Tren Pengelolaan Sampah
                </h3>
                <p className="text-slate-500">
                  Peningkatan jumlah sampah terkelola di Indonesia
                </p>
              </div>
              <div className="p-4">
                <WasteDataChart
                  data={managedWasteData}
                  colors={{
                    backgroundColor: "white",
                    lineColor: "#10b981",
                    textColor: "#334155",
                    areaTopColor: "rgba(16, 185, 129, 0.4)",
                    areaBottomColor: "rgba(16, 185, 129, 0.05)",
                  }}
                  title="Sampah Terkelola (ton/tahun)"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 pb-2">
                <h3 className="text-xl font-semibold mb-2 text-slate-800">
                  Tren Pengurangan Sampah
                </h3>
                <p className="text-slate-500">
                  Peningkatan jumlah sampah yang berhasil dikurangi
                </p>
              </div>
              <div className="p-4">
                <WasteDataChart
                  data={wasteReductionData}
                  colors={{
                    backgroundColor: "white",
                    lineColor: "#3b82f6",
                    textColor: "#334155",
                    areaTopColor: "rgba(59, 130, 246, 0.4)",
                    areaBottomColor: "rgba(59, 130, 246, 0.05)",
                  }}
                  title="Pengurangan Sampah (ton/tahun)"
                />
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold mb-4 text-slate-800">
              Mari Jadilah Bagian dari Solusi!
            </h3>
            <p className="text-lg text-slate-600 mb-8">
              40,17% sampah di Indonesia masih tidak terkelola. Dengan mendaur
              ulang dan menggunakan kembali barang bekas, kita bisa membantu
              mengurangi jumlah sampah yang berakhir di tempat pembuangan.
            </p>
            <Link
              to="/"
              onClick={() =>
                document
                  .getElementById("upload-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-medium rounded-full hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 inline-flex items-center"
            >
              <span>Mulai Daur Ulang Sekarang</span>
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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
    </div>
  );
};

export default WasteStatistics;
