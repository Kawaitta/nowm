# 1. Gunakan base image resmi dari Playwright (lebih stabil & sudah include browser)
# Image ini sudah menyertakan Node.js dan semua OS dependencies yang dibutuhkan.
FROM mcr.microsoft.com/playwright:v1.40.0-jammy

# 2. Tentukan direktori kerja
WORKDIR /app

# 3. Salin package.json dan package-lock.json
COPY package*.json ./

# 4. Install semua module yang ada di package.json
RUN npm install

# 5. Otomatis install Playwright browsers
# Perintah ini akan mengunduh browser binaries (Chromium, Firefox, Webkit)
RUN npx playwright install --with-deps

# 6. Salin semua file proyek
COPY . .

# 7. Port aplikasi
EXPOSE 5000

# 8. Jalankan aplikasi
CMD ["node", "js_app.js"]
