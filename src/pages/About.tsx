import React from "react";
import Fajar from "../images/Fajar.jpg";
import Akbar from "../images/Akbar.jpeg";
import Kevin from "../images/Kepin.jpeg";
import Try from "../images/Try.jpeg";

const About: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-900">
          Tentang Barbekraft
        </h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <img
            src="/images/about-header.jpg"
            alt="Tentang Barbekraft"
            className="w-full h-72 object-cover object-center"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src =
                "https://images.pexels.com/photos/5926370/pexels-photo-5926370.jpeg?auto=compress&cs=tinysrgb&w=1200";
            }}
          />

          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-blue-800">Misi Kami</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Barbekraft adalah platform inovatif yang menggabungkan teknologi
              kecerdasan buatan dengan semangat daur ulang untuk menciptakan
              solusi berkelanjutan bagi barang-barang bekas. Misi kami adalah
              untuk mengurangi limbah dan mengubah persepsi masyarakat tentang
              barang bekas melalui pendekatan teknologi yang kreatif.
            </p>

            <h2 className="text-2xl font-bold mb-4 text-blue-800">
              Bagaimana Kami Bekerja
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Dengan menggunakan model AI canggih, kami menganalisis foto barang
              bekas yang diunggah pengguna dan memberikan saran kreatif tentang
              cara mendaur ulang atau mengubahnya menjadi sesuatu yang baru dan
              bermanfaat. Platform kami juga berfungsi sebagai marketplace
              tempat pengguna dapat berbagi, menjual, atau menukar barang bekas
              dan hasil daur ulang mereka.
            </p>

            {/* Tim Pengembang Section */}
            <h2 className="text-2xl font-bold mb-4 text-blue-800">
              Tim Pengembang
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Barbekraft dikembangkan oleh tim ahli teknologi dan lingkungan
              yang berkomitmen untuk menciptakan solusi berkelanjutan melalui
              inovasi digital. Berikut adalah para pembuat yang telah
              berkontribusi dalam pengembangan platform revolusioner ini.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
              <div className="text-center bg-blue-50 rounded-lg p-4 hover:shadow-md transition-all">
                <img
                  src={Try}
                  alt="Try Apriyana Nugraha"
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-md"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://via.placeholder.com/150?text=Developer";
                  }}
                />
                <h3 className="font-bold text-lg text-blue-900">
                  Try Apriyana Nugraha
                </h3>
                <p className="text-blue-700 font-medium">
                  Image Scanning Engineer
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  Mengembangkan sistem pemindaian dan analisis gambar untuk
                  identifikasi barang bekas
                </p>
              </div>

              <div className="text-center bg-blue-50 rounded-lg p-4 hover:shadow-md transition-all">
                <img
                  src={Kevin}
                  alt="Kevin Ibrahimovic"
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-md"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://via.placeholder.com/150?text=Developer";
                  }}
                />
                <h3 className="font-bold text-lg text-blue-900">
                  Kevin Ibrahimovic
                </h3>
                <p className="text-blue-700 font-medium">
                  Evaluation Specialist
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  Bertanggung jawab untuk evaluasi performa sistem dan
                  pengembangan metrik kualitas
                </p>
              </div>

              <div className="text-center bg-blue-50 rounded-lg p-4 hover:shadow-md transition-all">
                <img
                  src={Fajar}
                  alt="Fajar Geran Arifin"
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-md"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://via.placeholder.com/150?text=Developer";
                  }}
                />
                <h3 className="font-bold text-lg text-blue-900">
                  Fajar Geran Arifin
                </h3>
                <p className="text-blue-700 font-medium">AI Development Lead</p>
                <p className="text-gray-600 text-sm mt-2">
                  Memimpin pengembangan logika kecerdasan buatan untuk
                  rekomendasi daur ulang
                </p>
              </div>

              <div className="text-center bg-blue-50 rounded-lg p-4 hover:shadow-md transition-all">
                <img
                  src={Akbar}
                  alt="Muhamad Akbar Hidayatuloh"
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-md"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://via.placeholder.com/150?text=Developer";
                  }}
                />
                <h3 className="font-bold text-lg text-blue-900">
                  Muhamad Akbar Hidayatuloh
                </h3>
                <p className="text-blue-700 font-medium">QA & UAT Specialist</p>
                <p className="text-gray-600 text-sm mt-2">
                  Menguji fungsionalitas sistem dan melakukan user acceptance
                  testing
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-8 border border-blue-200">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">
            Dampak Lingkungan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-3xl font-bold text-blue-600">500+</span>
              </div>
              <p className="text-gray-700">Barang Didaur Ulang</p>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-3xl font-bold text-blue-600">250kg</span>
              </div>
              <p className="text-gray-700">Sampah Terhindar dari TPA</p>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-3xl font-bold text-blue-600">150+</span>
              </div>
              <p className="text-gray-700">Kontributor Aktif</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
