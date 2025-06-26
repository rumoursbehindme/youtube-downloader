const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Set your FFmpeg binary location
const ffmpegDir = path.resolve(__dirname, 'ffmpeg/bin');

app.use(express.json());
app.use(express.static('public'));

// Sanitizes filename so OS doesn't freak out
const sanitize = str =>
  str.replace(/[^a-zA-Z0-9 \-_]/g, '')
     .replace(/\s+/g, ' ')
     .trim();

app.post('/download', (req, res) => {
  const { url, format_id } = req.body;
  if (!url || !format_id) {
    return res.status(400).json({ error: 'Missing params' });
  }

  // Get video title
  exec(`yt-dlp --get-title --user-agent "Mozilla/5.0" "${url}"`, (err, stdout) => {
    if (err) {
      console.error('❌ Error fetching title:', err);
      return res.status(500).json({ error: 'Failed to get video title' });
    }

    const titleRaw = stdout.trim();
    const safeTitle = sanitize(titleRaw);
    const folderPath = path.join(__dirname, 'downloads', safeTitle);

    try {
      fs.mkdirSync(folderPath, { recursive: true });
    } catch (e) {
      console.error('❌ Folder creation failed:', e);
      return res.status(500).json({ error: 'Failed to create folder' });
    }

    const isAudio = format_id.includes('bestaudio');
    const ext = isAudio ? 'mp3' : 'mp4';
    const audioOptions = isAudio ? '--extract-audio --audio-format mp3 --audio-quality 0' : '';
    const outputPath = path.join(folderPath, `%(title)s.${ext}`);

    // Download command
    const command = `yt-dlp -f "${format_id}" --ffmpeg-location "${ffmpegDir}" --user-agent "Mozilla/5.0" ${audioOptions} -o "${outputPath}" "${url}"`;

    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error('❌ Download failed:', stderr || err);
        return res.status(500).json({ error: stderr || 'Download failed' });
      }

      console.log(`✅ Download complete for: ${safeTitle}`);
      res.json({ message: `✅ Downloaded to /downloads/${safeTitle}/` });
    });
  });
});

app.listen(PORT, () => {
  console.log(`🔥 Server running at http://localhost:${PORT}`);
});
