// Pemetaan objek COCO-SSD ke kategori kerajinan
const objectMapping: Record<string, string> = {
  // Botol dan wadah
  bottle: "botol",
  "wine glass": "botol",
  cup: "kaleng",
  bowl: "kaleng",
  vase: "botol",

  // Kardus dan kotak
  box: "kardus",

  // Kertas dan buku
  book: "koran",
  newspaper: "koran",
  paper: "koran",

  // Kain dan pakaian
  tie: "kain",
  handbag: "kain",
  backpack: "kain",
  suitcase: "kain",
  shirt: "kain",
  dress: "kain",
  pants: "kain",
  scarf: "kain",
  glove: "kain",
  skirt: "kain",
  hat: "kain",
  sock: "kain",

  // Elektronik
  "cell phone": "elektronik",
  tv: "elektronik",
  laptop: "elektronik",
  remote: "elektronik",
  keyboard: "elektronik",
  mouse: "elektronik",
  microwave: "elektronik",
  oven: "elektronik",
  toaster: "elektronik",
  refrigerator: "elektronik",

  // Ban dan roda
  tire: "ban",
  wheel: "ban",
  bicycle: "ban",
  motorcycle: "ban",

  // Kayu
  bench: "kayu",
  chair: "kayu",
  "dining table": "kayu",
  "wooden spoon": "kayu",
  stick: "kayu",

  // CD/DVD
  cd: "cd",
  dvd: "cd",
  frisbee: "cd",

  // Tutup botol
  cap: "tutup-botol",
  "bottle cap": "tutup-botol",

  // Sendok/garpu
  spoon: "sendok-garpu",
  fork: "sendok-garpu",
  knife: "sendok-garpu",
  chopsticks: "sendok-garpu",

  // Sedotan
  straw: "sedotan",

  // Tambahan item umum rumah tangga
  scissors: "sendok-garpu",
  hairbrush: "sisir",
  comb: "sisir",
  toys: "mainan",
  toy: "mainan",
  spatula: "spatula",
  umbrella: "payung",
  pillow: "kain",
  towel: "kain",
  blanket: "kain",
  curtain: "kain",
};

export default objectMapping;
