// Import module
const express = require('express');
const axios = require('axios');
const app = express();

// Daftar kategori yang tersedia
const categories = [
    "waifu", "neko", "shinobu", "megumin", "bully", "cuddle", "cry", "hug", "awoo",
    "kiss", "lick", "pat", "smug", "bonk", "yeet", "blush", "smile", "wave", "highfive",
    "handhold", "nom", "bite", "glomp", "slap", "kill", "kick", "happy", "wink", "poke",
    "dance", "cringe"
];

// Membuat endpoint dinamis berdasarkan kategori
const nsfwCategories = [
    "waifu",
    "neko",
    "trap",
    "blowjob"
];
async function fetchImage(url, res) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        res.set('Content-Type', 'image/png');
        res.send(response.data);
    } catch (error) {
        console.error('Error fetching API:', error);
        res.status(500).send('An error occurred while fetching the image');
    }
}

// Endpoint untuk Sadcat
app.get('/sadcat', (req, res) => {
    const text = req.query.text || 'ga+subscribe+sycze';
    const apiUrl = `https://api.popcat.xyz/sadcat?text=${encodeURIComponent(text)}`;
    fetchImage(apiUrl, res);
});

// Endpoint untuk Nokia
app.get('/nokia', (req, res) => {
    const image = req.query.image || 'https://files.catbox.moe/7o0wuc.jpg';
    const apiUrl = `https://api.popcat.xyz/nokia?image=${encodeURIComponent(image)}`;
    fetchImage(apiUrl, res);
});

// Endpoint untuk Oogway
app.get('/oogway', (req, res) => {
    const text = req.query.text || 'use+https://sycze.my.id';
    const apiUrl = `https://api.popcat.xyz/oogway?text=${encodeURIComponent(text)}`;
    fetchImage(apiUrl, res);
});

// Endpoint untuk Communism
app.get('/communism', (req, res) => {
    const image = req.query.image || 'https://files.catbox.moe/7o0wuc.jpg';
    const apiUrl = `https://api.popcat.xyz/communism?image=${encodeURIComponent(image)}`;
    fetchImage(apiUrl, res);
});

// Endpoint untuk Jail
app.get('/jail', (req, res) => {
    const image = req.query.image || 'https://files.catbox.moe/7o0wuc.jpg';
    const apiUrl = `https://api.popcat.xyz/jail?image=${encodeURIComponent(image)}`;
    fetchImage(apiUrl, res);
});

// Endpoint untuk IMDb
app.get('/imdb', async (req, res) => {
    const query = req.query.q || 'spirited away';
    const apiUrl = `https://api.popcat.xyz/imdb?q=${encodeURIComponent(query)}`;

    try {
        const response = await axios.get(apiUrl);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching IMDb API:', error);
        res.status(500).send('An error occurred while fetching IMDb data');
    }
});

// Endpoint untuk Yotsuba AI Logic
app.get('/yotsuba', async (req, res) => {
    const query = req.query.q || 'kamu siapa';
    const logic = 'kamu adalah yotsuba ai yang baik dan pembuatmu adalah YudzDev';
    const apiUrl = `https://mannoffc-x.hf.space/ai/logic?q=${encodeURIComponent(query)}&logic=${encodeURIComponent(logic)}`;

    try {
        const response = await axios.get(apiUrl);
        let data = response.data;

        // Mengubah nilai "creator" menjadi "YudzDev"
        if (data && typeof data === 'object' && data.creator) {
            data.creator = "YudzDev";
        }

        console.log("✅ Response received and modified");
        res.json(data);
    } catch (error) {
        console.error("❌ Error:", error.response?.data || error.message);
        res.status(500).json({ error: 'Gagal mendapatkan data dari Yotsuba AI' });
    }
});

// Endpoint untuk YouTube to MP3
app.get('/ytmp3', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: "URL parameter is required" });

    const apiUrl = `https://ytdl.siputzx.my.id/api/convert?url=${encodeURIComponent(url)}&type=mp3`;

    try {
        const response = await axios.get(apiUrl);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching YTMP3 API:', error);
        res.status(500).send('An error occurred while fetching YouTube MP3 conversion');
    }
});

// Endpoint untuk YouTube to MP4
app.get('/ytmp4', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: "URL parameter is required" });

    const apiUrl = `https://ytdl.siputzx.my.id/api/convert?url=${encodeURIComponent(url)}&type=mp4`;

    try {
        const response = await axios.get(apiUrl);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching YTMP4 API:', error);
        res.status(500).send('An error occurred while fetching YouTube MP4 conversion');
    }
});

async function tiktokDl(url) {
    return new Promise(async (resolve, reject) => {
        try {
            function formatNumber(integer) {
                return Number(parseInt(integer)).toLocaleString().replace(/,/g, '.');
            }

            function formatDate(n, locale = 'en') {
                let d = new Date(n * 1000);
                return d.toLocaleDateString(locale, {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric'
                });
            }

            let domain = 'https://www.tikwm.com';
            let apiUrl = `${domain}/api/`;
            
            let res = await axios.get(apiUrl, {
                params: {
                    url: url,
                    count: 12,
                    cursor: 0,
                    web: 1,
                    hd: 1
                },
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10)'
                }
            });

            let result = res.data.data;
            if (!result) return reject('No data found');

            resolve({
                status: true,
                title: result.title,
                taken_at: formatDate(result.create_time),
                region: result.region,
                id: result.id,
                duration: result.duration + ' Seconds',
                cover: `${domain}${result.cover}`,  // Tambahkan domain
                video_url: `${domain}${result.hdplay}`, // FIXED: Tambahkan domain ke link HD tanpa watermark
                music_info: {
                    id: result.music_info.id,
                    title: result.music_info.title,
                    author: result.music_info.author,
                    album: result.music_info.album || null,
                    url: result.music_info.play
                },
                stats: {
                    views: formatNumber(result.play_count),
                    likes: formatNumber(result.digg_count),
                    comments: formatNumber(result.comment_count),
                    shares: formatNumber(result.share_count),
                    downloads: formatNumber(result.download_count)
                },
                author: {
                    id: result.author.id,
                    fullname: result.author.unique_id,
                    nickname: result.author.nickname,
                    avatar: `${domain}${result.author.avatar}` // FIXED: Tambahkan domain ke avatar
                }
            });
        } catch (e) {
            reject(e);
        }
    });
}

// Endpoint TikTok Downloader
app.get('/tiktok', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: "URL parameter is required" });

    try {
        const result = await tiktokDl(url);
        res.json(result);
    } catch (error) {
        console.error('Error fetching TikTok:', error);
        res.status(500).send('An error occurred while fetching TikTok video');
    }
});

// Endpoint Flux AI
app.get('/fluxai', async (req, res) => {
    const prompt = req.query.prompt;
    if (!prompt) return res.status(400).json({ error: "Parameter 'prompt' diperlukan" });

    try {
        // Panggil API Flux AI yang langsung mengirimkan gambar
        const response = await axios.get(`https://api.siputzx.my.id/api/ai/flux`, {
            params: { prompt },
            responseType: 'arraybuffer' // Pastikan response berupa gambar
        });

        // Set header agar browser tahu ini gambar
        res.set('Content-Type', 'image/png');
        res.send(response.data);
    } catch (error) {
        console.error('Error fetching Flux AI:', error);
        res.status(500).json({ error: 'Gagal mendapatkan gambar dari Flux AI' });
    }
});

// Endpoint Instagram Downloader
app.get('/igdl', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: "Parameter 'url' diperlukan" });

    try {
        // Request ke API Instagram Downloader
        const response = await axios.get(`https://api.siputzx.my.id/api/d/igdl`, {
            params: { url }
        });

        // Kirim hasilnya langsung ke pengguna
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching Instagram Downloader:', error);
        res.status(500).json({ error: 'Gagal mendapatkan data dari Instagram Downloader' });
    }
});

// Endpoint Spotify Downloader
app.get('/spotifydl', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: "Parameter 'url' diperlukan" });

    try {
        // Request ke API Spotify Downloader
        const apiUrl = `https://mannoffc-x.hf.space/download/spotify?url=${encodeURIComponent(url)}`;
        const response = await axios.get(apiUrl);

        let data = response.data;

        // Ubah "creator" menjadi "YudzDev"
        if (data && typeof data === 'object' && data.creator) {
            data.creator = "YudzDev";
        }

        console.log("✅ Spotify response received and modified");
        res.json(data);
    } catch (error) {
        console.error("❌ Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Gagal mendapatkan data dari Spotify Downloader" });
    }
});

app.get('/memegen', async (req, res) => {
    const { link, top, bottom, font } = req.query;

    if (!link || !top || !bottom || !font) {
        return res.status(400).json({ error: "Parameter 'link', 'top', 'bottom', dan 'font' diperlukan" });
    }

    try {
        const apiUrl = `https://api.siputzx.my.id/api/m/memgen?link=${encodeURIComponent(link)}&top=${encodeURIComponent(top)}&bottom=${encodeURIComponent(bottom)}&font=${encodeURIComponent(font)}`;
        console.log("🔍 Fetching from:", apiUrl);

        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

        const contentType = response.headers['content-type'];
        console.log("✅ Response received:", contentType);

        if (!contentType.includes('image')) {
            console.error("❌ Response Data:", response.data.toString());
            return res.status(500).json({ error: "API Siputz mengembalikan respons tidak valid" });
        }

        res.set('Content-Type', contentType);
        res.send(response.data);
    } catch (error) {
        console.error("❌ Error:", error.response?.data?.toString() || error.message);
        res.status(500).json({ error: 'Gagal mendapatkan gambar dari Meme Generator' });
    }
});

app.get('/pooh', async (req, res) => {
    const { text1, text2 } = req.query;

    if (!text1 || !text2) {
        return res.status(400).json({ error: "Parameter 'text1' dan 'text2' diperlukan" });
    }

    try {
        const apiUrl = `https://api.popcat.xyz/pooh?text1=${encodeURIComponent(text1)}&text2=${encodeURIComponent(text2)}`;
        console.log("🔍 Fetching from:", apiUrl);

        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

        const contentType = response.headers['content-type'];
        console.log("✅ Response received:", contentType);

        if (!contentType.includes('image')) {
            console.error("❌ Response Data:", response.data.toString());
            return res.status(500).json({ error: "API Popcat mengembalikan respons tidak valid" });
        }

        res.set('Content-Type', contentType);
        res.send(response.data);
    } catch (error) {
        console.error("❌ Error:", error.response?.data?.toString() || error.message);
        res.status(500).json({ error: 'Gagal mendapatkan gambar dari API Popcat' });
    }
});

app.get('/wanted', async (req, res) => {
    const { image } = req.query;

    if (!image) {
        return res.status(400).json({ error: "Parameter 'image' diperlukan" });
    }

    try {
        const apiUrl = `https://api.popcat.xyz/wanted?image=${encodeURIComponent(image)}`;
        console.log("🔍 Fetching from:", apiUrl);

        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

        const contentType = response.headers['content-type'];
        console.log("✅ Response received:", contentType);

        if (!contentType.includes('image')) {
            console.error("❌ Response Data:", response.data.toString());
            return res.status(500).json({ error: "API Popcat mengembalikan respons tidak valid" });
        }

        res.set('Content-Type', contentType);
        res.send(response.data);
    } catch (error) {
        console.error("❌ Error:", error.response?.data?.toString() || error.message);
        res.status(500).json({ error: 'Gagal mendapatkan gambar dari API Popcat' });
    }
});

app.get('/unforgivable', async (req, res) => {
    const { text } = req.query;

    if (!text) {
        return res.status(400).json({ error: "Parameter 'text' diperlukan" });
    }

    try {
        const apiUrl = `https://api.popcat.xyz/unforgivable?text=${encodeURIComponent(text)}`;
        console.log("🔍 Fetching from:", apiUrl);

        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

        const contentType = response.headers['content-type'];
        console.log("✅ Response received:", contentType);

        if (!contentType.includes('image')) {
            console.error("❌ Response Data:", response.data.toString());
            return res.status(500).json({ error: "API Popcat mengembalikan respons tidak valid" });
        }

        res.set('Content-Type', contentType);
        res.send(response.data);
    } catch (error) {
        console.error("❌ Error:", error.response?.data?.toString() || error.message);
        res.status(500).json({ error: 'Gagal mendapatkan gambar dari API Popcat' });
    }
});

app.get('/spotifysearch', async (req, res) => {
    const { s } = req.query;

    if (!s) {
        return res.status(400).json({ error: "Parameter 's' diperlukan" });
    }

    try {
        const apiUrl = `https://mannoffc-x.hf.space/search/spotify?s=${encodeURIComponent(s)}`;
        console.log("🔍 Fetching from:", apiUrl);

        const response = await axios.get(apiUrl);
        let data = response.data;

        // Mengubah nilai "creator" menjadi "YudzDev"
        if (data && typeof data === 'object') {
            data.creator = "YudzDev";
        }

        console.log("✅ Response received and modified");
        res.json(data);
    } catch (error) {
        console.error("❌ Error:", error.response?.data || error.message);
        res.status(500).json({ error: 'Gagal mendapatkan data dari API Spotify' });
    }
});

app.get('/ad', async (req, res) => {
    const { image } = req.query;

    if (!image) {
        return res.status(400).json({ error: "Parameter 'image' diperlukan" });
    }

    try {
        const apiUrl = `https://api.popcat.xyz/ad?image=${encodeURIComponent(image)}`;
        console.log("🔍 Fetching from:", apiUrl);

        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

        const contentType = response.headers['content-type'];
        console.log("✅ Response received:", contentType);

        if (!contentType.includes('image')) {
            console.error("❌ Response Data:", response.data.toString());
            return res.status(500).json({ error: "API Popcat mengembalikan respons tidak valid" });
        }

        res.set('Content-Type', contentType);
        res.send(response.data);
    } catch (error) {
        console.error("❌ Error:", error.response?.data?.toString() || error.message);
        res.status(500).json({ error: 'Gagal mendapatkan gambar dari API Popcat' });
    }
});

// Endpoint Weather
app.get('/weather', async (req, res) => {
    const q = req.query.q;
    if (!q) return res.status(400).json({ error: "Parameter 'q' diperlukan" });

    try {
        // Request ke API Weather dari Popcat
        const response = await axios.get(`https://api.popcat.xyz/weather`, {
            params: { q }
        });

        // Kirim hasilnya langsung ke pengguna
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching Weather API:', error);
        res.status(500).json({ error: 'Gagal mendapatkan data cuaca dari Popcat' });
    }
});

// Membuat endpoint dinamis berdasarkan kategori
categories.forEach(category => {
    app.get(`/${category}`, async (req, res) => {
        try {
            // Request ke API waifu.pics
            const response = await axios.get(`https://api.waifu.pics/sfw/${category}`);
            
            // Kirim hasilnya langsung ke pengguna
            res.json(response.data);
        } catch (error) {
            console.error(`Error fetching ${category}:`, error);
            res.status(500).json({ error: `Gagal mengambil data untuk kategori ${category}` });
        }
    });
});

nsfwCategories.forEach(category => {
    app.get(`/nsfw/${category}`, async (req, res) => {
        try {
            // Request ke API waifu.pics untuk NSFW
            const response = await axios.get(`https://api.waifu.pics/nsfw/${category}`);
            
            // Kirim hasilnya langsung ke pengguna
            res.json(response.data);
        } catch (error) {
            console.error(`Error fetching NSFW ${category}:`, error);
            res.status(500).json({ error: `Gagal mengambil data untuk kategori ${category}` });
        }
    });
});

// Endpoint XNXX
app.get('/xnxx', async (req, res) => {
    const message = req.query.message;
    if (!message) return res.status(400).json({ error: "Parameter 'message' diperlukan" });

    try {
        // Request ke API Agatz XNXX
        const response = await axios.get(`https://api.agatz.xyz/api/xnxx`, {
            params: { message }
        });

        // Kirim hasilnya langsung ke pengguna
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching XNXX API:', error);
        res.status(500).json({ error: 'Gagal mendapatkan data dari XNXX API' });
    }
});

// Endpoint XNXX Downloader
app.get('/xnxxdown', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: "Parameter 'url' diperlukan" });

    try {
        // Request ke API Agatz XNXX Downloader
        const response = await axios.get(`https://api.agatz.xyz/api/xnxxdown`, {
            params: { url }
        });

        // Kirim hasilnya langsung ke pengguna
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching XNXX Downloader API:', error);
        res.status(500).json({ error: 'Gagal mendapatkan data dari XNXX Downloader API' });
    }
});

app.listen(3000, () => {
    console.log('🚀 Server berjalan di https://api.sycze.my.id/ad');
});

module.exports = app;
