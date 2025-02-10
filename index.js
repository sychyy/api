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

// Menjalankan server di port 3000 (jika dijalankan secara lokal)
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;
