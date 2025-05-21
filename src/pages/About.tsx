import React from "react";
import Fajar from "../images/Fajar.jpg";
import Akbar from "../images/Akbar.jpeg";
import Kevin from "../images/Kepin.jpeg";
import Try from "../images/Try.jpeg";
import { motion } from "framer-motion";

const About: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 bg-gradient-to-b from-blue-50 to-white"
    >
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-6 text-center text-blue-900"
        >
          Tentang Barbekraft
        </motion.h1>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white rounded-lg shadow-md overflow-hidden mb-8"
        >
          <motion.img
            initial={{ scale: 1.1, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
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
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-bold mb-4 text-blue-800"
            >
              Misi Kami
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-700 mb-6 leading-relaxed"
            >
              Barbekraft adalah platform inovatif yang menggabungkan teknologi
              kecerdasan buatan dengan semangat daur ulang untuk menciptakan
              solusi berkelanjutan bagi barang-barang bekas. Misi kami adalah
              untuk mengurangi limbah dan mengubah persepsi masyarakat tentang
              barang bekas melalui pendekatan teknologi yang kreatif.
            </motion.p>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-2xl font-bold mb-4 text-blue-800"
            >
              Bagaimana Kami Bekerja
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-gray-700 mb-6 leading-relaxed"
            >
              Dengan menggunakan model AI canggih, kami menganalisis foto barang
              bekas yang diunggah pengguna dan memberikan saran kreatif tentang
              cara mendaur ulang atau mengubahnya menjadi sesuatu yang baru dan
              bermanfaat. Platform kami juga berfungsi sebagai marketplace
              tempat pengguna dapat berbagi, menjual, atau menukar barang bekas
              dan hasil daur ulang mereka.
            </motion.p>

            {/* Tim Pengembang Section */}
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-2xl font-bold mb-4 text-blue-800"
            >
              Tim Pengembang
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-gray-700 mb-6 leading-relaxed"
            >
              Barbekraft dikembangkan oleh tim ahli teknologi dan lingkungan
              yang berkomitmen untuk menciptakan solusi berkelanjutan melalui
              inovasi digital. Berikut adalah para pembuat yang telah
              berkontribusi dalam pengembangan platform revolusioner ini.
            </motion.p>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.2,
                  },
                },
              }}
              initial="hidden"
              animate="show"
            >
              {[
                {
                  img: Try,
                  name: "Try Apriyana Nugraha",
                  role: "Image Scanning Engineer",
                  desc: "Mengembangkan sistem pemindaian dan analisis gambar untuk identifikasi barang bekas",
                },
                {
                  img: Kevin,
                  name: "Kevin Ibrahimovic",
                  role: "Evaluation Specialist",
                  desc: "Bertanggung jawab untuk evaluasi performa sistem dan pengembangan metrik kualitas",
                },
                {
                  img: Fajar,
                  name: "Fajar Geran Arifin",
                  role: "AI Development Lead",
                  desc: "Memimpin pengembangan logika kecerdasan buatan untuk rekomendasi daur ulang",
                },
                {
                  img: Akbar,
                  name: "Muhamad Akbar Hidayatuloh",
                  role: "QA & UAT Specialist",
                  desc: "Menguji fungsionalitas sistem dan melakukan user acceptance testing",
                },
              ].map((member, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 },
                  }}
                  whileHover={{
                    y: -10,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                  }}
                  className="text-center bg-blue-50 rounded-lg p-4 hover:shadow-md transition-all"
                >
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    src={member.img}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-md"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "https://via.placeholder.com/150?text=Developer";
                    }}
                  />
                  <h3 className="font-bold text-lg text-blue-900">
                    {member.name}
                  </h3>
                  <p className="text-blue-700 font-medium">{member.role}</p>
                  <p className="text-gray-600 text-sm mt-2">{member.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-blue-50 rounded-lg p-6 mb-8 border border-blue-200"
        >
          <h2 className="text-2xl font-bold mb-4 text-blue-800">
            Dampak Lingkungan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { value: "500+", label: "Barang Didaur Ulang" },
              { value: "250kg", label: "Sampah Terhindar dari TPA" },
              { value: "150+", label: "Kontributor Aktif" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.2 }}
                whileHover={{ y: -5 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4 shadow-md"
                >
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 + index * 0.2, duration: 0.5 }}
                    className="text-3xl font-bold text-blue-600"
                  >
                    {stat.value}
                  </motion.span>
                </motion.div>
                <p className="text-gray-700">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default About;
