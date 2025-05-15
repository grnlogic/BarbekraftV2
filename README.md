# BarbekRaft - Platform Daur Ulang Kreatif dengan AI

![BarbekRaft Logo](https://dummyimage.com/600x400/000/fff&text=BarbekRaft)

BarbekRaft adalah platform inovatif yang menggunakan kecerdasan buatan untuk menganalisis barang bekas dan memberikan rekomendasi kreatif untuk mendaur ulang. Kami bertujuan untuk mengurangi limbah, meningkatkan kreativitas, dan memberikan kesempatan kedua pada barang-barang yang sudah tidak terpakai.

## Tentang Proyek

Platform ini menggabungkan teknologi pengenalan gambar dengan model AI canggih untuk:

- Mengidentifikasi jenis barang bekas dari foto yang diunggah
- Menyarankan cara kreatif untuk mendaur ulang barang tersebut
- Memberikan petunjuk langkah demi langkah untuk mengubah barang bekas menjadi kreasi bernilai

## Tim Pengembang

> **Proyek ini dikembangkan dengan kontribusi dari:**
>
> - [https://github.com/tryaannn](https://github.com/tryaannn) - Pengembangan logika scanning image
> - [https://github.com/grnlogic](https://github.com/grnlogic) - Pengembangan dan integrasi AI

## Fitur Utama

- 📷 **Analisis Gambar**: Unggah foto barang bekas dan dapatkan analisis instan
- 🤖 **Rekomendasi AI**: Dapatkan ide daur ulang kreatif dengan bantuan model AI (Google Gemini)
- 🛠️ **Tutorial Terperinci**: Petunjuk lengkap dengan daftar bahan, langkah-langkah, dan tingkat kesulitan
- 🖼️ **Galeri Inspirasi**: Jelajahi koleksi ide daur ulang populer dari komunitas
- 📱 **Responsif**: Antarmuka pengguna yang optimal di semua perangkat

## Teknologi yang Digunakan

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express
- **AI & ML**: Google Gemini API, OpenAI API
- **Image Processing**: TensorFlow.js

## Prasyarat

- Node.js (v14 atau lebih baru)
- npm/yarn
- API key untuk layanan AI:
  - Google Gemini API key
  - OpenAI API key
  - (Opsional) Deepseek API key

## Instalasi dan Penggunaan

1. **Clone repositori**

   ```bash
   git clone https://github.com/username/barbekraft.git
   cd barbekraft
   ```

2. **Instal dependensi**

   ```bash
   # Instal dependensi server
   cd server
   npm install

   # Instal dependensi client
   cd ../client
   npm install
   ```

3. **Konfigurasi environment variables**
   Buat file `.env` di folder server dengan konfigurasi API key dan pengaturan yang diperlukan

4. **Jalankan aplikasi**

   ```bash
   # Jalankan server
   cd server
   npm run dev

   # Jalankan client
   cd ../client
   npm start
   ```

## Kontribusi

Kami sangat menghargai kontribusi! Jika Anda ingin berkontribusi pada proyek ini, silakan buka issue atau kirimkan pull request.

## Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE)

---

Dibuat dengan ❤️ untuk lingkungan dan kreativitas
