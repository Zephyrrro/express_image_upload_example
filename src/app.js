const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const port = process.env.PORT || 7777;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, "static"));
  },
  filename: (req, file, callback) => {
    const filename = file.originalname;
    const extName = filename.slice(filename.lastIndexOf("."));
    callback(null, `${file.fieldname}-${Date.now()}${extName}`);
  }
});

const upload = multer({ storage });

app.all("*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Content-Length, Authorization, Accept,X-Requested-With"
  );
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", " 3.2.1");
  next();
});

app.get("/", (req, res) => {
  res
    .status(200)
    .sendFile("index.html", { root: path.join(__dirname, "/public") });
  res.send;
});

app.get("/image/", (req, res, next) => {
  const filename = req.query.filename;
  try {
    //  判断文件是否存在
    fs.statSync(path.join(__dirname, `static`, filename));
    console.log("file exist");
    res.sendFile(path.join(__dirname, `static`, filename));
  } catch {
    console.log("file doesn't exist");
    next();
  }
});

app.post("/uploadImage", upload.single("upload"), (req, res) => {
  const file = req.file;
  res.send(file);
});

app.get("*", (req, res) => {
  console.log("404 handler");
  res.status(404).sendFile(path.join(__dirname, "public", `404.html`));
});

app.listen(port, () => console.log(`Server started on port ${port}`));
