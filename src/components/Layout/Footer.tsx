import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">BarbekraftV2</h3>
            <p className="text-gray-400">
              Platform untuk mendaur ulang barang bekas menjadi barang
              bermanfaat, membantu lingkungan dan memberikan nilai tambah pada
              barang bekas.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Tautan</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/" className="hover:text-white transition">
                  Beranda
                </a>
              </li>
              <li>
                <a href="/items" className="hover:text-white transition">
                  Barang Bekas
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-white transition">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white transition">
                  Kontak
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Hubungi Kami</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info@barbekraft.id</li>
              <li>Telepon: +62 123 4567 890</li>
              <li>Alamat: Jl. Daur Ulang No. 123, Jakarta</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} BarbekraftV2. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
