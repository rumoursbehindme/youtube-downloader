// server.js
const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

app.post('/download', (req, res) => {
    const { url, format_id } = req.body;
    if (!url || !format_id) return res.status(400).json({ error: 'Missing params' });

    exec(`yt-dlp --get-title "${url}"`, (err, stdout) => {
        if (err) return res.status(500).json({ error: 'Failed to get video title' });

        const title = stdout.trim().replace(/[^a-zA-Z0-9-_ ]/g, '');
        const folderPath = path.join(__dirname, 'downloads', title);
        fs.mkdirSync(folderPath, { recursive: true });

        const isAudio = format_id.includes('bestaudio');
        const audioOptions = isAudio ? '--extract-audio --audio-format mp3 --audio-quality 0' : '';
        const ext = isAudio ? 'mp3' : 'mp4';
        const outputPath = path.join(folderPath, `%(title)s.${ext}`);

        exec(`yt-dlp -f ${format_id} ${audioOptions} -o "${outputPath}" "${url}"`, (err, stdout, stderr) => {
            if (err) return res.status(500).json({ error: stderr });
            res.json({ message: `Downloaded to /downloads/${title}/` });
        });
    });
});

app.listen(PORT, () => {
    console.log(`🔥 Server running at http://localhost:${PORT}`);
});
