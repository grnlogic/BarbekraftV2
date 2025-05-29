// client/api/analyze-image.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import formidable from "formidable";
import fs from "fs";

const MODEL_NAME = "gemini-1.5-flash-latest";
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

function fileBufferToGenerativePart(buffer, mimeType) {
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType,
    },
  };
}

// Vercel configuration to disable bodyParser
export const config = {
  api: {
    bodyParser: false, // Disable default body parser to handle file uploads
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end("Method Not Allowed");
  }

  if (!API_KEY) {
    return res
      .status(500)
      .json({ error: "Konfigurasi server error. API Key tidak ada." });
  }

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  const form = formidable({});

  try {
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err);
          return;
        }
        resolve([fields, files]);
      });
    });

    const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;

    if (!imageFile) {
      return res.status(400).json({
        error: 'Tidak ada file gambar yang diunggah dengan field "image".',
      });
    }

    const imageFileBuffer = fs.readFileSync(imageFile.filepath);
    const imagePart = fileBufferToGenerativePart(
      imageFileBuffer,
      imageFile.mimetype
    );

    const generationConfig = {
      temperature: 0.4,
      topK: 32,
      topP: 1,
      maxOutputTokens: 4096,
    };

    const textPrompt =
      "Analisis gambar ini dan identifikasi objek-objek utama yang terlihat. " +
      "Untuk setiap objek, berikan nama objek (dalam bahasa Indonesia jika memungkinkan) dan skor kepercayaan singkat (misalnya, 'tinggi', 'sedang', 'rendah') atau persentase jika model mendukung. " +
      "Format respons Anda secara EKSKLUSIF sebagai array JSON. Setiap item dalam array harus berupa objek dengan properti 'class' untuk nama objek dan 'score' untuk skor kepercayaan (gunakan nilai numerik antara 0.0 hingga 1.0, di mana 1.0 adalah kepercayaan tertinggi, atau gunakan null jika tidak ada skor spesifik). " +
      'Contoh: [{"class": "botol plastik", "score": 0.9}, {"class": "kardus bekas", "score": 0.75}]';

    // Struktur parts yang benar untuk model multimodal
    const parts = [
      imagePart, // Part 1: Gambar
      { text: textPrompt }, // Part 2: Teks prompt sebagai objek {text: "..."}
    ];

    // Gunakan 'parts' yang sudah benar strukturnya
    const result = await model.generateContent({
      contents: [{ role: "user", parts: parts }], // Kirim 'parts' yang sudah dibentuk
      generationConfig,
    });

    const responseText = result.response.text();

    let detectedObjects = [];
    try {
      // --- MODIFIKASI DIMULAI DI SINI ---
      let jsonString = responseText;

      // Coba ekstrak JSON dari blok Markdown ```json ... ```
      const markdownMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
      if (markdownMatch && markdownMatch[1]) {
        jsonString = markdownMatch[1];
      } else {
        // Jika tidak ada blok Markdown, coba cari awal '[' atau '{'
        // Ini adalah pendekatan yang lebih sederhana dan mungkin perlu disesuaikan
        // jika ada karakter '[' atau '{' lain sebelum JSON sebenarnya.
        const startIndex = jsonString.indexOf("[");
        const endIndex = jsonString.lastIndexOf("]");
        // Anda bisa menambahkan logika serupa untuk objek JSON yang dimulai dengan '{' dan diakhiri '}'
        // const startIndexObj = jsonString.indexOf('{');
        // const endIndexObj = jsonString.lastIndexOf('}');

        if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
          jsonString = jsonString.substring(startIndex, endIndex + 1);
        }
      }

      detectedObjects = JSON.parse(jsonString); // Parse string JSON yang sudah dibersihkan
      // --- MODIFIKASI SELESAI DI SINI ---

      // Sisa logika validasi array dan mapping tetap sama
      if (Array.isArray(detectedObjects)) {
        detectedObjects = detectedObjects
          .map((obj) => ({
            class: obj.class || "objek tidak dikenal",
            score: obj.score !== undefined ? Number(obj.score) : 0.5,
          }))
          .filter((obj) => obj.class !== "objek tidak dikenal");
      } else {
        if (typeof detectedObjects === "object" && detectedObjects !== null) {
          const keyWithArray = Object.keys(detectedObjects).find((k) =>
            Array.isArray(detectedObjects[k])
          );
          if (keyWithArray && Array.isArray(detectedObjects[keyWithArray])) {
            detectedObjects = detectedObjects[keyWithArray]
              .map((obj) => ({
                class: obj.class || "objek tidak dikenal",
                score: obj.score !== undefined ? Number(obj.score) : 0.5,
              }))
              .filter((obj) => obj.class !== "objek tidak dikenal");
          } else {
            detectedObjects = [
              {
                class: "deskripsi_umum_setelah_ekstraksi",
                description: responseText, // Gunakan responseText asli untuk deskripsi fallback
                score: 1.0,
              },
            ];
          }
        } else {
          detectedObjects = [
            {
              class: "deskripsi_umum_setelah_ekstraksi",
              description: responseText,
              score: 1.0,
            },
          ];
        }
      }
    } catch (parseError) {
      detectedObjects = [
        {
          class: "deskripsi_umum_error_parse_setelah_ekstraksi",
          description: responseText, // Gunakan responseText asli untuk deskripsi fallback
          score: 1.0,
        },
      ];
    }

    if (imageFile.filepath) {
      try {
        fs.unlinkSync(imageFile.filepath);
      } catch (unlinkErr) {
        // Silent error handling
      }
    }

    res.status(200).json({ detectedObjects });
  } catch (error) {
    res.status(500).json({
      error: "Terjadi kesalahan internal server saat menganalisis gambar.",
      details: error.message,
    });
  }
}
