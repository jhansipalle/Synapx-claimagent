const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const { extractFields } = require("./extract");
const { validateFields } = require("./validator");
const { classifyClaim } = require("./classifier");
const { decideWorkflow } = require("./workflow");
const { extractTextFromPDF, extractFromPDF } = require("./pdfExtractor");
const { processFNOLFromText } = require("./pdfProcessorLogic");

const upload = multer({ dest: "uploads/" });

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Claims Agent Backend Running" });
});

app.post("/process-fnol", (req, res) => {
  try {
    const data = req.body;

    const extracted = extractFields(data);
    const missing = validateFields(extracted);
    const classification = classifyClaim(extracted);
    const workflow = decideWorkflow(extracted, missing, classification);

    res.json({
      extractedFields: extracted,
      missingFields: missing,
      recommendedRoute: workflow.route,
      reasoning: workflow.reason
    });
  } catch (err) {
    console.error("process-fnol error:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

app.post("/upload-pdf", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No PDF uploaded" });

    const extractedText = await extractTextFromPDF(req.file.path);

    res.json({
      message: "PDF processed successfully",
      extractedText: extractedText
    });
  } catch (err) {
    console.error("upload-pdf error:", err);
    res.status(500).json({ error: "PDF processing failed", details: err.message });
  }
});

app.post("/upload-and-process", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No PDF uploaded" });

    
    const pdfPath = req.file.path;
    const rawText = await extractTextFromPDF(pdfPath);

    const fnolCandidate = processFNOLFromText(rawText || "");

    const extracted = extractFields(fnolCandidate);
    if (extracted._rawText) delete extracted._rawText;
  
    const missing = validateFields(extracted);
    const classification = classifyClaim(extracted);
    const workflow = decideWorkflow(extracted, missing, classification);
   
    res.json({
      extractedFields: extracted,
      missingFields: missing,
      recommendedRoute: workflow.route,
      reasoning: workflow.reason
    });
  } catch (err) {
    console.error("upload-and-process error:", err);
    res.status(500).json({ error: "Processing failed", details: err.message });
  }
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`Claims Agent running on port ${PORT}`));
