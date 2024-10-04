const express = require('express');
const fs = require('fs');
const app = express();
const cors = require('cors');
const port = 5000;

app.use(cors()); // Allow cross-origin requests

// Serve the homepage
app.get("/", (req, res) => {
  res.send("Welcome to the Video Streaming Service");
});

// Serve video streaming route
app.get("/video/:videoName", (req, res) => {
  const videoPath = `${__dirname}/${req.params.videoName}.mp4`; // Serve video based on the name provided in the request params

  fs.stat(videoPath, (err, stat) => {
    if (err || !stat) {
      return res.status(404).send("File not found");
    }

    const fileSize = stat.size;
    const range = req.headers.range;

    if (!range) {
      return res.status(400).send("Requires Range header");
    }

    const chunkSize = 10 ** 6; // 1MB chunk size
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + chunkSize, fileSize - 1);

    const contentLength = end - start + 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, headers);

    const fileStream = fs.createReadStream(videoPath, { start, end });
    fileStream.pipe(res);
  });
});

app.listen(port, () => {
  console.log(`Video Streaming Server is running at http://localhost:${port}`);
});
