const express = require('express');
const axios = require('axios');
const app = express();

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
    const image = req.query.image || 'https://cdn.popcat.xyz/popcat.png';
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
    const image = req.query.image || 'https://cdn.popcat.xyz/popcat.png';
    const apiUrl = `https://api.popcat.xyz/communism?image=${encodeURIComponent(image)}`;
    fetchImage(apiUrl, res);
});

// Endpoint untuk Jail
app.get('/jail', (req, res) => {
    const image = req.query.image || 'https://cdn.popcat.xyz/popcat.png';
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
    const logic = 'kamu adalah yotsuba ai yang baik';
    const apiUrl = `https://mannoffc-x.hf.space/ai/logic?q=${encodeURIComponent(query)}&logic=${encodeURIComponent(logic)}`;

    try {
        const response = await axios.get(apiUrl);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching Yotsuba AI:', error);
        res.status(500).send('An error occurred while fetching Yotsuba AI response');
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
app.get('/spotify', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: "Parameter 'url' diperlukan" });

    try {
        // Request ke API Spotify Downloader
        const response = await axios.get(`https://api.siputzx.my.id/api/d/spotify`, {
            params: { url }
        });

        // Kirim hasilnya langsung ke pengguna
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching Spotify Downloader:', error);
        res.status(500).json({ error: 'Gagal mendapatkan data dari Spotify Downloader' });
    }
});

app.get('/memegen', async (req, res) => {
    const { link, top, bottom, font } = req.query;

    if (!link || !top || !bottom || !font) {
        return res.status(400).json({ error: "Parameter 'link', 'top', 'bottom', dan 'font' diperlukan" });
    }

    try {
        const response = await axios.get(`https://api.siputzx.my.id/api/m/memgen`, {
            params: { link, top, bottom, font },
            responseType: 'arraybuffer' // Mengambil data sebagai buffer (gambar)
        });

        res.set('Content-Type', 'image/png'); // Set header agar dikirim sebagai gambar
        res.send(response.data);
    } catch (error) {
        console.error('Error fetching Meme Generator:', error.message);
        res.status(500).json({ error: 'Gagal mendapatkan gambar dari Meme Generator' });
    }
});

// Menjalankan server di port 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;
