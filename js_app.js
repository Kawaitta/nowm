const express = require('express');
const { firefox } = require('playwright');

const app = express();
app.use(express.json());

// Fungsi untuk cek tag terlarang (sama seperti contains_forbidden_tag)
const containsForbiddenTag = (text) => {
    const lowerText = text.toLowerCase();
    return lowerText.includes("<video") || lowerText.includes("<img");
};

// Fungsi utama untuk ekstraksi menggunakan Playwright
async function extractVideoSrc(url) {
    const browser = await firefox.launch({ headless: true });

    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        await page.goto(url, { waitUntil: 'networkidle' });

        // Tunggu sampai video ATAU img muncul (timeout 5 detik)
        await page.waitForFunction(() => {
            return document.querySelector('video') || document.querySelector('img');
        }, { timeout: 3000 });

        // Evaluasi di dalam browser untuk mengambil src
        const videoSrc = await page.evaluate(() => {
            const video = document.querySelector('video');
            if (video && video.src) return video.src;

            const img = document.querySelector('img');
            if (img && img.src) return img.src;

            return null;
        });

        if (!videoSrc) {
            throw new Error("Video atau gambar tidak ditemukan");
        }

        if (videoSrc.startsWith("blob:")) {
            throw new Error("Blob URL tidak didukung");
        }

        return videoSrc;

    } finally {
        // Pastikan browser ditutup meskipun terjadi error
        await browser.close();
    }
}

// Route POST /extract
app.post('/extract', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: "URL wajib diisi" });
    }

    if (containsForbiddenTag(url)) {
        return res.status(403).json({
            error: "Tag <video> atau <img> tidak diperbolehkan"
        });
    }

    try {
        const videoSrc = await extractVideoSrc(url);
        return res.json({ video_src: videoSrc });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});