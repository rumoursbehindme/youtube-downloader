const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const ffmpegDir = path.resolve(__dirname, 'ffmpeg/bin');

app.use(express.json());
app.use(express.static('public'));

const sanitize = str =>
  str.replace(/[^a-zA-Z0-9 \-_]/g, '').replace(/\s+/g, ' ').trim();

app.post('/download', (req, res) => {
  const { url, format_id } = req.body;
  if (!url || !format_id) return res.status(400).json({ error: 'Missing params' });

  exec(`yt-dlp --get-title --user-agent "Mozilla/5.0" "${url}"`, (err, stdout) => {
    if (err) {
      console.error('❌ Error fetching title:', err);
      return res.status(500).json({ error: '❌ Failed to get video title' });
    }

    const titleRaw = stdout.trim();
    const safeTitle = sanitize(titleRaw);
    const isAudio = format_id.includes('bestaudio');
    const ext = isAudio ? 'mp3' : 'mp4';
    const audioOptions = isAudio ? '--extract-audio --audio-format mp3 --audio-quality 0' : '';
    const tempFile = path.join(__dirname, 'temp', `${safeTitle}.${ext}`);

    fs.mkdirSync(path.dirname(tempFile), { recursive: true });

    const command = `yt-dlp -f "${format_id}" --ffmpeg-location "${ffmpegDir}" --user-agent "Mozilla/5.0" ${audioOptions} -o "${tempFile}" "${url}"`;

    exec(command, (err, stdout, stderr) => {
      if (err || !fs.existsSync(tempFile)) {
        console.error('❌ Download error:', stderr || err);
        return res.status(500).json({ error: '❌ Download failed or file missing' });
      }

      res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.${ext}"`);
      res.setHeader('Content-Type', isAudio ? 'audio/mpeg' : 'video/mp4');

      const stream = fs.createReadStream(tempFile);
      stream.pipe(res);

      stream.on('end', () => {
        fs.unlink(tempFile, err => {
          if (err) console.error('⚠️ Failed to delete temp file:', err);
          else console.log(`🧹 Deleted ${tempFile}`);
        });
        console.log(`✅ File sent: ${safeTitle}.${ext}`);
      });

      stream.on('error', err => {
        console.error('❌ Streaming error:', err);
        res.status(500).end();
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`🔥 Server running at http://localhost:${PORT}`);
});
