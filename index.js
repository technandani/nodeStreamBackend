const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 5000;

app.use(cors());

app.use(express.static('public'));

const videoUrls = [
  "videos/multer.mp4",
  "videos/nodestream.mp4",
];

app.get("/", (req, res) => {
  res.send("Welcome to the Video Streaming Service");
});

app.get("/videos", (req, res) => {
  res.json(videoUrls);
});

app.get("/video/:videoIndex", (req, res) => {
  const videoIndex = parseInt(req.params.videoIndex, 10);
  
  if (isNaN(videoIndex) || videoIndex < 0 || videoIndex >= videoUrls.length) {
    return res.status(404).send("Video not found");
  }

  const videoPath = path.join(__dirname, "public", videoUrls[videoIndex]);
  res.sendFile(videoPath);
});

app.listen(port, () => {
  console.log(`Video Streaming Server is running at http://localhost:${port}`);
});
