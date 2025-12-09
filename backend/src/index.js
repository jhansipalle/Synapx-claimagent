const express = require("express");
const cors = require("cors");
const multer = require("multer");

const { extractFields } = require("./extract");
const { validateFields } = require("./validator");
const { classifyClaim } = require("./classifier");
const { decideWorkflow } = require("./workflow");
const { extractTextFromPDF } = require("./pdfExtractor");

// Storage for PDF uploads
const upload = multer({ dest: "uploads/" });

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Claims Agent Backend Running" });
});

/* --------------------------------------------------
   1️⃣ MAIN FNOL JSON PROCESSOR (Assignment Requirement)
----------------------------------------------------- */
app.post("/process-fnol", (req, res) => {
  const data = req.body;

  // 1. Extract fields
  const extracted = extractFields(data);

  // 2. Validate missing or inconsistent fields
  const missing = validateFields(extracted);

  // 3. Classify claim type
  const classification = classifyClaim(extracted);

  // 4. Decide workflow routing
  const workflow = decideWorkflow(extracted, missing, classification);

  // 5. Return structured JSON output
  res.json({
    extractedFields: extracted,
    missingFields: missing,
    recommendedRoute: workflow.route,
    reasoning: workflow.reason,
  });
});

/* --------------------------------------------------
   2️⃣ PDF UPLOAD + TEXT EXTRACTION ENDPOINT
----------------------------------------------------- */
app.post("/upload-pdf", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No PDF uploaded" });
  }

  try {
    const extractedText = await extractTextFromPDF(req.file.path);

    res.json({
      message: "PDF processed successfully",
      extractedText: extractedText,
    });
  } catch (err) {
    console.error("PDF Error:", err.message);
    res.status(500).json({
      error: "PDF processing failed",
      details: err.message,
    });
  }
});

/* --------------------------------------------------
   3️⃣ START SERVER
----------------------------------------------------- */
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`Claims Agent running on port ${PORT}`));
