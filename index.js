require('dotenv').config();
const express = require('express');
const validUrl = require('valid-url');

const cors = require('cors');
const app = express();
const urls = [];

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

const isValidUrl = (str) => {
  return validUrl.isWebUri(str);
}

app.post("/api/shorturl", (req, res) => {
  const { url } = req.body;
  console.log(url);
  if (isValidUrl(url)) {
    urls.push(url);
    const index = urls.indexOf(url)
    return res.json({ "original_url": url, "short_url": index });
  }
  res.json({ "error": 'invalid url' });
});

app.get("/api/shorturl/:short_url", (req, res) => {
  const { short_url } = req.params;
  const url = urls.at(short_url);
  res.redirect(`${url}`);
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
