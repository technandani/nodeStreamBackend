const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 5000;

// Enable CORS
app.use(cors());

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Video URLs (forward slashes)
const videoUrls = [
  "videos/multer.mp4",
  "videos/multer.mp4",
  "videos/multer.mp4"
];

// Welcome route
app.get("/", (req, res) => {
  res.send("Welcome to the Video Streaming Service");
});

// Return video URLs as JSON
app.get("/videos", (req, res) => {
  res.json(videoUrls);
});

// Stream video by index
app.get("/video/:videoIndex", (req, res) => {
  const videoIndex = parseInt(req.params.videoIndex, 10);
  
  if (isNaN(videoIndex) || videoIndex < 0 || videoIndex >= videoUrls.length) {
    return res.status(404).send("Video not found");
  }

  // Use path to resolve the full file path and stream the video
  const videoPath = path.join(__dirname, "public", videoUrls[videoIndex]);
  res.sendFile(videoPath);
});

// Start the server
app.listen(port, () => {
  console.log(`Video Streaming Server is running at http://localhost:${port}`);
});
