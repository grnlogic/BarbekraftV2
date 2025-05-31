import React, { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";

const Contact: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    // Gunakan EmailJS untuk mengirim email
    emailjs
      .sendForm(
        "service_6arcyf1", // Ganti dengan Service ID dari EmailJS
        "template_ar34opn", // Ganti dengan Template ID dari EmailJS
        form.current as HTMLFormElement,
        "yn6i5JwYfqT_KiN2r" // Ganti dengan Public Key dari EmailJS
      )
      .then((result) => {
        setIsSubmitting(false);
        setSubmitSuccess(true);
        // Reset form
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      })
      .catch((error) => {
        setIsSubmitting(false);
        setSubmitError(
          "Terjadi kesalahan saat mengirim pesan. Silakan coba lagi."
        );
      });
  };

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

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
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-6 text-center"
          style={{ color: "#6b8e23" }}
        >
          Hubungi Kami
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-white rounded-xl shadow-md p-6 mb-8 border"
              style={{ borderColor: "#d9ed92" }}
            >
              <h2
                className="text-xl font-semibold mb-4"
                style={{ color: "#6b8e23" }}
              >
                Informasi Kontak
              </h2>

              <motion.div
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
                className="space-y-4"
              >
                {[
                  {
                    icon: "phone",
                    title: "Telepon",
                    content: "+62 895-3522-81010",
                  },
                  {
                    icon: "email",
                    title: "Email",
                    content: "info@barbekraft.id",
                  },
                  {
                    icon: "address",
                    title: "Alamat",
                    content:
                      "Universitas Siliwangi Kampus 2, Tasikmalaya, Jawa Barat, Indonesia",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      show: { opacity: 1, y: 0 },
                    }}
                    className="flex items-start"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="p-3 rounded-full mr-4"
                      style={{ backgroundColor: "rgba(217, 237, 146, 0.3)" }}
                    >
                      {/* Icon content - simplified for brevity */}
                      {item.icon === "phone" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          style={{ color: "#6b8e23" }}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      )}
                      {item.icon === "email" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          style={{ color: "#6b8e23" }}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                      {item.icon === "address" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          style={{ color: "#6b8e23" }}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      )}
                    </motion.div>
                    <div>
                      <h3 className="font-medium" style={{ color: "#6b8e23" }}>
                        {item.title}
                      </h3>
                      <p className="text-gray-600">{item.content}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.0612344332247!2d108.2164012!3d-7.3484956!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6f575362aaad19%3A0x56c254ce9fab5759!2sUniversitas%20Siliwangi%20Kampus%202!5e0!3m2!1sid!2sid!4v1666853665784!5m2!1sid!2sid"
                width="100%"
                height="300"
                style={{ border: 0 }}
                loading="lazy"
                title="Barbekraft Office Location"
              ></iframe>
            </motion.div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white rounded-xl shadow-md p-6 border"
            style={{ borderColor: "#d9ed92" }}
          >
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: "#6b8e23" }}
            >
              Kirim Pesan
            </h2>

            {submitSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4"
                role="alert"
              >
                <strong className="font-bold">Sukses! </strong>
                <span className="block sm:inline">
                  Pesan Anda telah terkirim. Kami akan segera menghubungi Anda.
                </span>
              </motion.div>
            ) : (
              <motion.form
                ref={form}
                onSubmit={handleSubmit}
                className="space-y-4"
                initial="hidden"
                animate="visible"
                variants={formVariants}
              >
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative"
                    role="alert"
                  >
                    <strong className="font-bold">Error! </strong>
                    <span className="block sm:inline">{submitError}</span>
                  </motion.div>
                )}

                {[
                  {
                    id: "name",
                    label: "Nama Lengkap",
                    type: "text",
                    value: formData.name,
                    required: true,
                  },
                  {
                    id: "email",
                    label: "Email",
                    type: "email",
                    value: formData.email,
                    required: true,
                  },
                ].map((field) => (
                  <motion.div key={field.id} variants={itemVariants}>
                    <label
                      htmlFor={field.id}
                      className="block text-sm font-bold mb-2"
                      style={{ color: "#6b8e23" }}
                    >
                      {field.label}
                    </label>
                    <motion.input
                      whileFocus={{
                        scale: 1.01,
                        boxShadow: "0 0 0 3px rgba(153, 217, 140, 0.2)",
                      }}
                      type={field.type}
                      id={field.id}
                      name={field.id}
                      value={field.value}
                      onChange={handleChange}
                      required={field.required}
                      className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-300"
                      style={{ borderColor: "#d9ed92" }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#99d98c";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#d9ed92";
                      }}
                    />
                  </motion.div>
                ))}

                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-bold mb-2"
                    style={{ color: "#6b8e23" }}
                  >
                    Subjek
                  </label>
                  <motion.select
                    whileFocus={{
                      scale: 1.01,
                      boxShadow: "0 0 0 3px rgba(153, 217, 140, 0.2)",
                    }}
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-300"
                    style={{ borderColor: "#d9ed92" }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#99d98c";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#d9ed92";
                    }}
                  >
                    <option value="">Pilih Subjek</option>
                    <option value="general">Pertanyaan Umum</option>
                    <option value="support">Dukungan Teknis</option>
                    <option value="partnership">Kerjasama</option>
                    <option value="feedback">Saran dan Masukan</option>
                  </motion.select>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="message"
                    className="block text-sm font-bold mb-2"
                    style={{ color: "#6b8e23" }}
                  >
                    Pesan
                  </label>
                  <motion.textarea
                    whileFocus={{
                      scale: 1.01,
                      boxShadow: "0 0 0 3px rgba(153, 217, 140, 0.2)",
                    }}
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-300"
                    style={{ borderColor: "#d9ed92" }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#99d98c";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#d9ed92";
                    }}
                  ></motion.textarea>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full text-white font-bold py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-50 transition duration-300 ${
                      isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    style={{
                      background: "linear-gradient(to right, #99d98c, #d9ed92)",
                    }}
                  >
                    {isSubmitting ? "Mengirim..." : "Kirim Pesan"}
                  </motion.button>
                </motion.div>
              </motion.form>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
