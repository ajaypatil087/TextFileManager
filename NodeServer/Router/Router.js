const express = require("express");
const PFs = require("fs").promises;
const fs = require("fs");
const FileUtils = require("../FileUtil/FileUtils");
const path = require("path");

const router = express.Router();

router.get("/", (req, res) => res.status(200).json({ res: "Server is up" }));

router.post("/create", async (req, res) => {
  try {
    const { fileName } = req.body;
    const filePath = FileUtils.filePath(`${fileName}.txt`);
    const exists = await FileUtils.fileExist(filePath);
    if (exists) {
      return res.status(409).json({ res: "File already exist" });
    }
    await PFs.writeFile(filePath, "", "utf-8");
    const fileList = await PFs.readdir("./assets");
    const list = fileList.map((file) => file.substring(0, file.length - 4));
    return res.status(200).json({ res: list });
  } catch (er) {
    return res.status(500).json({ error: "Internal server Error" });
  }
});

router.put("/write", async (req, res) => {
  try {
    const { fileName, newContent } = req.body;
    const filePath = FileUtils.filePath(`${fileName}.txt`);
    const exists = await FileUtils.fileExist(filePath);
    if (!exists) {
      return res.status(409).json({ error: "File doesn't exist" });
    }
    await PFs.appendFile(filePath, " " + newContent);
    return res.status(200).json({ res: "Content added to file" });
  } catch (er) {
    return res.status(500).json({ error: "Internal server Error" });
  }
});

router.get("/readfile/:fileName", async (req, res) => {
  try {
    const { fileName } = req.params;
    const filePath = FileUtils.filePath(`${fileName}.txt`);
    const exists = await FileUtils.fileExist(filePath);
    if (!exists) {
      return res.status(409).json({ error: "File doesn't exist" });
    }
    res.setHeader("Content-disposition", `attachment; filename=${filePath}`);
    res.setHeader("Content-type", "application/text");
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on("end", () => {
      res.end();
    });

    fileStream.on("error", (er) => {
      console.error("Error reading the file:", err);
      res.status(500).send("Error reading the file");
    });
  } catch (er) {
    return res.status(500).json({ error: "Internal server Error" });
  }
});

router.put("/clearcontent", async (req, res) => {
  try {
    const { fileName } = req.body;
    const filePath = FileUtils.filePath(`${fileName}.txt`);
    const exists = await FileUtils.fileExist(filePath);
    if (!exists) {
      return res.status(409).json({ error: "Invalid file name" });
    }
    await PFs.writeFile(filePath, "", "utf-8");
    return res.status(200).json({ res: "File content cleared" });
  } catch (er) {
    return res.status(500).json({ error: "Internal server Error" });
  }
});

router.delete("/delete/:fileName", async (req, res) => {
  try {
    const { fileName } = req.params;
    const filePath = FileUtils.filePath(`${fileName}.txt`);
    const exists = await FileUtils.fileExist(filePath);
    if (!exists) {
      return res.status(409).json({ error: "File doesn't exist" });
    }
    await PFs.unlink(filePath);
    const fileList = await PFs.readdir("./assets");
    const list = fileList.map((file) => file.substring(0, file.length - 4));
    return res.status(200).json({ res: list });
  } catch (er) {
    console.log(er);
    return res.status(500).json({ error: "Internal server Error" });
  }
});

router.get("/filelist", async (req, res) => {
  try {
    const fileList = await PFs.readdir("./assets");
    const list = fileList.map((file) => file.substring(0, file.length - 4));
    return res.status(200).json({ res: list });
  } catch (er) {
    return res.status(500).json({ error: "Internal server Error" });
  }
});

router.get("/songlist", async (req, res) => {
  try {
    const fileList = await PFs.readdir("./Music");
    const list = fileList.map((file) => file.substring(0, file.length - 4));
    return res.status(200).json({ res: list });
  } catch (er) {
    return res.status(500).json({ error: "Internal server Error" });
  }
});

router.get("/music/:song", async (req, res) => {
  try {
    const song = req.params.song;
    const filePath = path.join(__dirname, `../Music/${song}.mp3`);
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.header.range;
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunckSize = end - start + 1;
      const file = fs.createReadStream(filePath, { start, end });
      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunckSize,
        "Content-Type": "audio/peg",
      });
      file.pipe(res);
      file.on("end", () => {
        res.end();
      });
    } else {
      res.writeHead(200, {
        "Content-Length": fileSize,
        "Content-Type": "audio/mpeg",
      });
      const stream = fs.createReadStream(filePath);
      stream.on("end", () => {
        res.end();
      });
      stream.pipe(res);
    }
  } catch (er) {
    console.log(er);
    return res.status(500).json({ error: "Internal server Error" });
  }
});

module.exports = router;
