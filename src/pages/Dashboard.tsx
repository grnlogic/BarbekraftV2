import React from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

// Sub-components for Dashboard
const DashboardHome = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <h2 className="text-2xl font-bold mb-4" style={{ color: "#99d98c" }}>
      Dashboard Overview
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        { title: "Barang Saya", value: "12", color: "green" },
        { title: "Ide Daur Ulang", value: "27", color: "green" },
        { title: "Transaksi", value: "5", color: "green" },
      ].map((card, index) => (
        <motion.div
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          whileHover={{
            y: -5,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          }}
          className="bg-white p-6 rounded-xl shadow-md border transition-all"
          style={{ borderColor: "#d9ed92" }}
        >
          <h3
            className="text-lg font-semibold mb-2"
            style={{ color: "#99d98c" }}
          >
            {card.title}
          </h3>
          <p className="text-3xl font-bold" style={{ color: "#99d98c" }}>
            {card.value}
          </p>
        </motion.div>
      ))}
    </div>

    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="mt-8 bg-white p-6 rounded-xl shadow-md"
    >
      <h3 className="text-lg font-semibold mb-4" style={{ color: "#99d98c" }}>
        Aktivitas Terbaru
      </h3>
      <motion.div
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
        className="space-y-4"
      >
        {[
          {
            text: "Anda menambahkan barang baru: Botol Plastik Bekas",
            time: "2 jam yang lalu",
          },
          {
            text: "Barang anda mendapat ide daur ulang baru",
            time: "5 jam yang lalu",
          },
          {
            text: "Seseorang tertarik dengan barang anda: Kardus Bekas",
            time: "1 hari yang lalu",
          },
        ].map((activity, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 10 },
              show: { opacity: 1, y: 0 },
            }}
            className="border-b pb-3"
            style={{ borderColor: "#d9ed92" }}
          >
            <p className="text-gray-600">{activity.text}</p>
            <p className="text-sm text-gray-500">{activity.time}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  </motion.div>
);

const MyItems = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <h2 className="text-2xl font-bold mb-4" style={{ color: "#99d98c" }}>
      Barang Saya
    </h2>
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-xl shadow-md overflow-hidden"
    >
      <div
        className="p-4 flex justify-between items-center"
        style={{ backgroundColor: "rgba(217, 237, 146, 0.3)" }}
      >
        <motion.input
          whileFocus={{
            scale: 1.01,
            boxShadow: "0 0 0 3px rgba(153, 217, 140, 0.2)",
          }}
          type="text"
          placeholder="Cari barang..."
          className="border rounded-lg px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:border-transparent"
          style={{ borderColor: "#d9ed92" }}
          onFocus={(e) => {
            e.target.style.boxShadow = "0 0 0 2px #99d98c";
          }}
          onBlur={(e) => {
            e.target.style.boxShadow = "";
          }}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-white font-medium py-2 px-4 rounded-lg shadow-sm transition duration-300"
          style={{ background: "linear-gradient(to right, #99d98c, #d9ed92)" }}
        >
          Tambah Barang
        </motion.button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead style={{ backgroundColor: "rgba(217, 237, 146, 0.3)" }}>
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: "#99d98c" }}
              >
                Nama
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: "#99d98c" }}
              >
                Kondisi
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: "#99d98c" }}
              >
                Tanggal
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: "#99d98c" }}
              >
                Ide Daur Ulang
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: "#99d98c" }}
              >
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
                      className="h-10 w-10 rounded-full object-cover border"
                      style={{ borderColor: "#d9ed92" }}
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
                <span
                  className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  style={{
                    backgroundColor: "rgba(217, 237, 146, 0.3)",
                    color: "#99d98c",
                  }}
                >
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
                <a
                  href="#"
                  className="hover:opacity-80 mr-3"
                  style={{ color: "#99d98c" }}
                >
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
    </motion.div>
  </motion.div>
);

const Profile = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <h2 className="text-2xl font-bold mb-4" style={{ color: "#99d98c" }}>
      Profil Saya
    </h2>
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex flex-col md:flex-row items-start">
        <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
          <img
            src="https://via.placeholder.com/150"
            alt="Profile"
            className="w-32 h-32 rounded-full mb-4 object-cover border-4"
            style={{ borderColor: "#d9ed92" }}
          />
          <button
            className="font-medium py-2 px-4 rounded-lg transition duration-300"
            style={{
              backgroundColor: "rgba(217, 237, 146, 0.3)",
              color: "#99d98c",
            }}
          >
            Ubah Foto
          </button>
        </div>

        <div className="md:w-2/3">
          <form className="space-y-4">
            <div>
              <label
                className="block text-sm font-bold mb-2"
                htmlFor="name"
                style={{ color: "#99d98c" }}
              >
                Nama Lengkap
              </label>
              <input
                id="name"
                type="text"
                className="shadow-sm border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ borderColor: "#d9ed92" }}
                onFocus={(e) => {
                  e.target.style.boxShadow = "0 0 0 2px #99d98c";
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = "";
                }}
                defaultValue="John Doe"
              />
            </div>

            <div>
              <label
                className="block text-sm font-bold mb-2"
                htmlFor="email"
                style={{ color: "#99d98c" }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                className="shadow-sm border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ borderColor: "#d9ed92" }}
                onFocus={(e) => {
                  e.target.style.boxShadow = "0 0 0 2px #99d98c";
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = "";
                }}
                defaultValue="john@example.com"
              />
            </div>

            <div>
              <label
                className="block text-sm font-bold mb-2"
                htmlFor="phone"
                style={{ color: "#99d98c" }}
              >
                Nomor Telepon
              </label>
              <input
                id="phone"
                type="text"
                className="shadow-sm border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ borderColor: "#d9ed92" }}
                onFocus={(e) => {
                  e.target.style.boxShadow = "0 0 0 2px #99d98c";
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = "";
                }}
                defaultValue="+62 123 4567 890"
              />
            </div>

            <div>
              <label
                className="block text-sm font-bold mb-2"
                htmlFor="address"
                style={{ color: "#99d98c" }}
              >
                Alamat
              </label>
              <textarea
                id="address"
                className="shadow-sm border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ borderColor: "#d9ed92" }}
                onFocus={(e) => {
                  e.target.style.boxShadow = "0 0 0 2px #99d98c";
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = "";
                }}
                rows={3}
                defaultValue="Jl. Daur Ulang No. 123, Jakarta"
              />
            </div>

            <div>
              <button
                type="submit"
                className="text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
                style={{
                  background: "linear-gradient(to right, #99d98c, #d9ed92)",
                }}
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </motion.div>
);

const Dashboard: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 min-h-screen"
      style={{
        background:
          "linear-gradient(to bottom, rgba(59, 130, 246, 0.1), rgba(255, 255, 255, 1))",
      }}
    >
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-6 border-b pb-2 border-green-200"
        style={{ color: "#6b8e23" }}
      >
        Dashboard
      </motion.h1>

      <div className="flex flex-col md:flex-row">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="md:w-1/4 mb-6 md:mb-0 md:pr-6"
        >
          <motion.div
            whileHover={{
              y: -5,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
            className="bg-white rounded-xl shadow-md p-4 mb-6 border"
            style={{ borderColor: "#d9ed92" }}
          >
            <div className="flex items-center mb-4">
              <img
                src="https://via.placeholder.com/50"
                alt="Profile"
                className="w-12 h-12 rounded-full mr-4 border-2"
                style={{ borderColor: "#d9ed92" }}
              />
              <div>
                <p className="font-semibold" style={{ color: "#6b8e23" }}>
                  {user?.name || "User"}
                </p>
                <p className="text-sm text-gray-600">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-md overflow-hidden border"
            style={{ borderColor: "#d9ed92" }}
          >
            <nav className="flex flex-col">
              {[
                { path: "/dashboard", label: "Dashboard" },
                { path: "/dashboard/items", label: "Barang Saya" },
                { path: "/dashboard/profile", label: "Profil" },
                { path: "/dashboard/settings", label: "Pengaturan" },
              ].map((item, index) => (
                <motion.div key={index}>
                  <Link
                    to={item.path}
                    className="px-4 py-3 border-l-4 border-transparent transition duration-200 text-gray-700 block hover:border-green-400"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(217, 237, 146, 0.2)";
                      e.currentTarget.style.borderLeftColor = "#99d98c";
                      e.currentTarget.style.color = "#6b8e23";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "";
                      e.currentTarget.style.borderLeftColor = "transparent";
                      e.currentTarget.style.color = "#374151";
                    }}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="md:w-3/4"
        >
          <div
            className="bg-white rounded-xl shadow-md border border-gray-200 p-6"
            style={{ borderColor: "#d9ed92" }}
          >
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/items" element={<MyItems />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<div>Pengaturan</div>} />
            </Routes>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
