# YouTube Downloader App

🔥 YouTube video downloader built with Node.js and Express, leveraging `yt-dlp` and `ffmpeg` to allow users to download either best quality MP4 videos or MP3 audio only, straight from the browser.

---

## 🚀 Features

- Paste any valid YouTube URL and preview the thumbnail instantly.
- Choose format: Best quality video (MP4) or audio (MP3).
- Automatically converts audio to `.mp3` using FFmpeg.
- Downloads are saved inside `downloads/{video-title}/`.
- Clean, modern UI with real-time download status.

---

## 📁 Project Structure

```
Youtube Downloader App
├── public
│   └── index.html         # The frontend page
├── downloads              # Downloaded files stored here
├── server.js              # Node.js + Express backend
└── README.md              # This file
```

---

## 🛠 Requirements
- Node.js (v24 or higher)
- yt-dlp (installed globally or accessible via PATH)
- ffmpeg (must be installed and available in the specified path)

### 🐍 Installing yt-dlp

```bash
pip install -U yt-dlp
```

### 🍫 Installing FFmpeg (Windows with Chocolatey)

```bash
choco install ffmpeg
```

> ⚠️ If yt-dlp can't find ffmpeg, manually set the path in `server.js` using `--ffmpeg-location`.

---

## ⚙️ Usage

1. Clone the repo:

```bash
git clone https://github.com/rumoursbehindme/youtube-downloader.git
```

2. Navigate to the directory:

```bash
cd youtube-downloader
```

3. Install dependencies:

```bash
npm install
```

4. Start the server:

```bash
npm start
```

5. Open browser:

```
http://localhost:3000
```

---

## 🧠 Tech Stack

- **Frontend**: HTML + Vanilla JS + CSS
- **Backend**: Express.js (Node.js)
- **Download Engine**: yt-dlp + ffmpeg

---

## 📸 Screenshots

![Image Not Found](public/image.png)

---

## 📄 License

[MIT](LICENSE)

---

## 💡 Credits

- [yt-dlp](https://github.com/yt-dlp/yt-dlp)
- [ffmpeg](https://ffmpeg.org/)
- Design + Dev by **Rajeev Hegde** 
