# 1. Gunakan image Node.js versi LTS sebagai dasar
FROM node:20-slim

# 2. Tentukan direktori kerja di dalam kontainer
WORKDIR /app

# 3. Salin package.json dan package-lock.json terlebih dahulu
# Ini dilakukan agar 'npm install' hanya jalan jika ada perubahan pada dependencies (cache optimization)
COPY package*.json ./

# 4. Install dependencies
RUN npm install --production

# 5. Salin seluruh kode sumber proyek ke dalam kontainer
COPY . .

# 6. Tentukan perintah untuk menjalankan aplikasi
# Karena file utamanya 'js_app.js', kita panggil menggunakan node
CMD ["node", "js_app.js"]
