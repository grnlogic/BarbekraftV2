import React from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Sub-components for Dashboard
const DashboardHome = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4 text-blue-900">
      Dashboard Overview
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-md border border-blue-100 transition-all hover:border-blue-300">
        <h3 className="text-lg font-semibold mb-2 text-blue-800">
          Barang Saya
        </h3>
        <p className="text-3xl font-bold text-blue-600">12</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-blue-100 transition-all hover:border-blue-300">
        <h3 className="text-lg font-semibold mb-2 text-blue-800">
          Ide Daur Ulang
        </h3>
        <p className="text-3xl font-bold text-blue-600">27</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-blue-100 transition-all hover:border-blue-300">
        <h3 className="text-lg font-semibold mb-2 text-blue-800">Transaksi</h3>
        <p className="text-3xl font-bold text-blue-600">5</p>
      </div>
    </div>

    <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-blue-900">
        Aktivitas Terbaru
      </h3>
      <div className="space-y-4">
        <div className="border-b border-blue-100 pb-3">
          <p className="text-gray-600">
            Anda menambahkan barang baru:{" "}
            <span className="font-medium text-blue-700">
              Botol Plastik Bekas
            </span>
          </p>
          <p className="text-sm text-gray-500">2 jam yang lalu</p>
        </div>
        <div className="border-b border-blue-100 pb-3">
          <p className="text-gray-600">
            Barang anda mendapat ide daur ulang baru
          </p>
          <p className="text-sm text-gray-500">5 jam yang lalu</p>
        </div>
        <div className="border-b border-blue-100 pb-3">
          <p className="text-gray-600">
            Seseorang tertarik dengan barang anda:{" "}
            <span className="font-medium text-blue-700">Kardus Bekas</span>
          </p>
          <p className="text-sm text-gray-500">1 hari yang lalu</p>
        </div>
      </div>
    </div>
  </div>
);

const MyItems = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4 text-blue-900">Barang Saya</h2>
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-4 flex justify-between items-center bg-blue-50">
        <input
          type="text"
          placeholder="Cari barang..."
          className="border border-blue-200 rounded-lg px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition duration-300">
          Tambah Barang
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                Nama
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                Kondisi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                Tanggal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                Ide Daur Ulang
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full object-cover border border-blue-200"
                      src="https://via.placeholder.com/150"
                      alt=""
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      Botol Plastik Bekas
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  Baik
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                20 Oct 2023
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                3
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <a href="#" className="text-blue-600 hover:text-blue-900 mr-3">
                  Edit
                </a>
                <a href="#" className="text-red-600 hover:text-red-900">
                  Delete
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const Profile = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4 text-blue-900">Profil Saya</h2>
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex flex-col md:flex-row items-start">
        <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
          <img
            src="https://via.placeholder.com/150"
            alt="Profile"
            className="w-32 h-32 rounded-full mb-4 object-cover border-4 border-blue-100"
          />
          <button className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-2 px-4 rounded-lg transition duration-300">
            Ubah Foto
          </button>
        </div>

        <div className="md:w-2/3">
          <form className="space-y-4">
            <div>
              <label
                className="block text-blue-800 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Nama Lengkap
              </label>
              <input
                id="name"
                type="text"
                className="shadow-sm border border-blue-200 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                defaultValue="John Doe"
              />
            </div>

            <div>
              <label
                className="block text-blue-800 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                className="shadow-sm border border-blue-200 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                defaultValue="john@example.com"
              />
            </div>

            <div>
              <label
                className="block text-blue-800 text-sm font-bold mb-2"
                htmlFor="phone"
              >
                Nomor Telepon
              </label>
              <input
                id="phone"
                type="text"
                className="shadow-sm border border-blue-200 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                defaultValue="+62 123 4567 890"
              />
            </div>

            <div>
              <label
                className="block text-blue-800 text-sm font-bold mb-2"
                htmlFor="address"
              >
                Alamat
              </label>
              <textarea
                id="address"
                className="shadow-sm border border-blue-200 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                defaultValue="Jl. Daur Ulang No. 123, Jakarta"
              />
            </div>

            <div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-900 border-b border-blue-100 pb-2">
        Dashboard
      </h1>

      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/4 mb-6 md:mb-0 md:pr-6">
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <div className="flex items-center mb-4">
              <img
                src="https://via.placeholder.com/50"
                alt="Profile"
                className="w-12 h-12 rounded-full mr-4 border-2 border-blue-200"
              />
              <div>
                <p className="font-semibold text-blue-900">
                  {user?.name || "User"}
                </p>
                <p className="text-sm text-gray-600">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <nav className="flex flex-col">
              <Link
                to="/dashboard"
                className="px-4 py-3 hover:bg-blue-50 border-l-4 border-transparent hover:border-blue-500 transition duration-200 text-gray-700 hover:text-blue-900"
              >
                Dashboard
              </Link>
              <Link
                to="/dashboard/items"
                className="px-4 py-3 hover:bg-blue-50 border-l-4 border-transparent hover:border-blue-500 transition duration-200 text-gray-700 hover:text-blue-900"
              >
                Barang Saya
              </Link>
              <Link
                to="/dashboard/profile"
                className="px-4 py-3 hover:bg-blue-50 border-l-4 border-transparent hover:border-blue-500 transition duration-200 text-gray-700 hover:text-blue-900"
              >
                Profil
              </Link>
              <Link
                to="/dashboard/settings"
                className="px-4 py-3 hover:bg-blue-50 border-l-4 border-transparent hover:border-blue-500 transition duration-200 text-gray-700 hover:text-blue-900"
              >
                Pengaturan
              </Link>
            </nav>
          </div>
        </div>

        <div className="md:w-3/4">
          <div className="bg-white rounded-xl shadow-md p-6">
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/items" element={<MyItems />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<div>Pengaturan</div>} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
