import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { nanoid } from 'nanoid';

const app = express();
const PORT = 3000;

// In-memory database
const urlDatabase = {};

app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// API to shorten a URL
app.post('/shorten', (req, res) => {
    const { longUrl } = req.body;

    if (!longUrl) {
        return res.status(400).json({ error: 'Invalid URL' });
    }

    // Generate a unique short ID
    const shortId = nanoid(6);
    const shortUrl = `${req.protocol}://${req.get('host')}/${shortId}`;

    // Store the mapping in the database
    urlDatabase[shortId] = longUrl;

    res.json({ shortUrl, longUrl });
});

// Handle redirection
app.get('/:shortId', (req, res) => {
    const { shortId } = req.params;

    const longUrl = urlDatabase[shortId];
    if (!longUrl) {
        return res.status(404).send('<h1>Short URL not found</h1>');
    }

    res.redirect(longUrl);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});