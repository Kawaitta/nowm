# 1. Gunakan base image Playwright (karena paling berat depedensinya)
FROM mcr.microsoft.com/playwright:v1.40.0-jammy

# 2. Install ngrok binary
RUN apt-get update && apt-get install -y curl && \
    curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null && \
    echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | tee /etc/apt/sources.list.d/ngrok.list && \
    apt-get update && apt-get install ngrok

# 3. Tentukan direktori kerja
WORKDIR /app

# 4. Install dependencies proyek
COPY package*.json ./
RUN npm install
RUN npx playwright install --with-deps

# 5. Salin kode proyek
COPY . .

# 6. Expose port aplikasi
EXPOSE 5000

# 7. Jalankan aplikasi dan ngrok sekaligus menggunakan shell
# Ganti YOUR_AUTHTOKEN dengan token asli kamu
CMD ngrok config add-authtoken 34djM6nPnjJ88b3m1WkX4rC0HC8_5J7VyC6xoUKJq9YD8EpP9 && \
    ngrok http 5000 & node js_app.js
