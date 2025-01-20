const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const tesseract = require("tesseract.js");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());


//Setting up multer to store uploaded files in memory (without saving them to disk)
const upload = multer({ storage: multer.memoryStorage() });


//POST route for file uploads
app.post("/api/upload", upload.single("file"), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).send({ error: "No file uploaded" });

  try {
    // Check if the uploaded file is a PDF-> parse the pdf
    if (file.mimetype === "application/pdf") {
      const text = await pdfParse(file.buffer);
      res.json({ text: text.text });
    } 
    //If the uploaded file is an image -> use tesseract
    else if (file.mimetype.startsWith("image/")) {
      const result = await tesseract.recognize(file.buffer, "eng");
      res.json({ text: result.data.text });
    } 
    // else throw error 
    else {
      res.status(400).send({ error: "Unsupported file format" });
    }
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).send({ error: "Failed to process file" });
  }
});


//port listening 
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
