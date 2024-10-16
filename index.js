const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());

const videoUrls = [
  "https://res.cloudinary.com/dpmengi5q/video/upload/v1729100776/multer_y08vdz.mp4",
  "https://res.cloudinary.com/dpmengi5q/video/upload/v1729100777/nodejs_btnaoo.mp4",
  "https://res.cloudinary.com/dpmengi5q/video/upload/v1729100777/nodestream_zgnubu.mp4"
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

  res.redirect(videoUrls[videoIndex]);
});

app.listen(port, () => {
  console.log(`Video Streaming Server is running at http://localhost:${port}`);
});
