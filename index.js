const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 5000;

app.use(cors());

app.use(cors({
  origin: "https://node-stream-gamma.vercel.app/",
  methods: ["GET", "POST"],
  credentials: true,
}));

// Serve static files from the "public" diretctory
app.use(express.static(path.join(__dirname, 'public')));

// List of available videos
const videoUrls = [
  "videos/multer.mp4",
  "videos/nodestream.mp4",
];

// Route to list available videos
app.get("/videos", (req, res) => {
  res.json(videoUrls);
});

// Route to stream a specific video
app.get("/video/:videoName", (req, res) => {
  const videoName = req.params.videoName;
  const videoPath = path.join(__dirname, "public", "videos", `${videoName}.mp4`);

  if (!fs.existsSync(videoPath)) {
    return res.status(404).send("Video not found");
  }

  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;

  // Handle range requests for video streaming
  const range = req.headers.range;
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize) {
      return res.status(416).send("Requested range not satisfiable");
    }

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": end - start + 1,
      "Content-Type": "video/mp4",
    });

    // Create a read stream for the requested range
    const fileStream = fs.createReadStream(videoPath, { start, end });
    fileStream.pipe(res);
  } else {
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    });
    fs.createReadStream(videoPath).pipe(res);
  }
});

//defaulat route
app.get("/", (req, res) => {
  res.send("Welcome to the Video Streaming Service");
});


app.listen(port, () => {
  console.log(`Video Streaming Server is running at http://localhost:${port}`);
});