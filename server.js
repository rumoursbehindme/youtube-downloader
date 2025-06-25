const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

app.post('/download', (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  exec(`yt-dlp --get-title ${url}`, (err, stdout) => {
    if (err) return res.status(500).json({ error: 'Failed to get video title' });

    const title = stdout.trim().replace(/[^a-zA-Z0-9-_ ]/g, '');
    const folderPath = path.join(__dirname, 'downloads', title);
    fs.mkdirSync(folderPath, { recursive: true });

    const outputPath = path.join(folderPath, '%(title)s.%(ext)s');
    const formatSelector = 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]';

    exec(`yt-dlp -f "${formatSelector}" -o "${outputPath}" ${url}`, (err, stdout, stderr) => {
      if (err) return res.status(500).json({ error: stderr });
      return res.json({ message: `Downloaded to /downloads/${title}` });
    });
  });
});

app.listen(PORT, () => {
  console.log(`🔥 Server running at http://localhost:${PORT}`);
});
