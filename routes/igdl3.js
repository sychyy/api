const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();

router.get('/', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ status: "error", message: "Parameter 'url' tidak boleh kosong!" });

    try {
        const baseApi = 'https://savereels.io/api/ajaxSearch';
        const postData = new URLSearchParams({
            q: url,
            w: "",
            v: "v2",
            lang: "en",
            cftoken: ""
        });

        const headers = {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Accept": "*/*",
            "X-Requested-With": "XMLHttpRequest",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
        };

        const response = await axios.post(baseApi, postData, { headers });
        const $ = cheerio.load(response.data);

        const thumbnail = $('img').attr('src') || null;
        const videoUrl = $('a').attr('href') || null;

        if (!videoUrl) {
            return res.status(404).json({ status: "error", message: "Gagal mengambil data video!" });
        }

        res.json({
            status: "success",
            codeby: "Tanmyname-py & Sycze",
            data: {
                thumb: thumbnail,
                dl_url: videoUrl
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Terjadi kesalahan dalam mengambil data!" });
    }
});

module.exports = router;