import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const isLoggedIn = !!localStorage.getItem("authToken");
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    // Add event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-blue-500/70 backdrop-blur-md shadow-lg drop-shadow-xl"
          : "bg-gradient-to-r from-blue-500 to-indigo-600 drop-shadow-md"
      } text-white`}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          BarbekraftV2
        </Link>

        <div className="flex space-x-4">
          <Link to="/" className="hover:text-blue-200 transition">
            Beranda
          </Link>
          <Link to="/items" className="hover:text-blue-200 transition">
            Barang Bekas
          </Link>
          <Link to="/about" className="hover:text-blue-200 transition">
            Tentang Kami
          </Link>
          <Link to="/contact" className="hover:text-blue-200 transition">
            Hubungi Kami
          </Link>

          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="hover:text-blue-200 transition">
                Dashboard
              </Link>
              <button
                className="hover:text-blue-200 transition"
                onClick={() => {
                  localStorage.removeItem("authToken");
                  window.location.href = "/";
                }}
              >
                Keluar
              </button>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
