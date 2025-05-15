import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center backdrop-blur-sm bg-white/80 p-8 rounded-xl shadow-lg">
        <div className="mb-6">
          <svg
            className="mx-auto h-24 w-24 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          404 - Halaman Tidak Ditemukan
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah
          dipindahkan.
        </p>
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300 shadow-md transform hover:-translate-y-1"
          >
            Kembali ke Beranda
          </Link>
          <div className="mt-4">
            <Link
              to="/items"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Lihat Barang Bekas
            </Link>{" "}
            |{" "}
            <Link
              to="/contact"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
