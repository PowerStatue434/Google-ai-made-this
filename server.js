const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = 3000;

// Host our static frontend directory files (html, css, js) natively
app.use(express.static(__dirname));

// The Core Traffic Rewriter & CORS Middleware Proxy Gateway
app.get('/proxy', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).send('Error: Missing target parameter source endpoint routing values.');
    }

    try {
        // Fetch target raw content headers and streams securely through server context
        const response = await axios.get(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
            },
            responseType: 'text'
        });

        let htmlContent = response.data;

        // HIGH PERFORMANCE URL REWRITING ENGINE:
        // Converts broken relative asset calls into functional structural proxy URLs
        const parsedUrl = new URL(targetUrl);
        const originUrl = parsedUrl.origin;

        // Rewrite relative links, stylesheets, and images to stream safely through the proxy server
        htmlContent = htmlContent.replace(/(href|src)="\/([^"\s>]+)"/g, (match, attribute, relativePath) => {
            // Ignore absolute external domains that are already fully defined
            if (relativePath.startsWith('http')) return match;
           
            const fullAssetUrl = `${originUrl}/${relativePath}`;
            return `${attribute}="/proxy?url=${encodeURIComponent(fullAssetUrl)}"`;
        });

        // Push sanitized content buffers smoothly out to the client browser layout frame
        res.setHeader('Content-Type', 'text/html');
        res.send(htmlContent);

    } catch (error) {
        res.status(500).send(`<h3>Proxy Error: Navigation to structural target failed.</h3><p>${error.message}</p>`);
    }
});

app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 AETHER SECURE PROXY ENGINE ACTIVE AT: http://localhost:${PORT}`);
    console.log(`====================================================`);
});
      
