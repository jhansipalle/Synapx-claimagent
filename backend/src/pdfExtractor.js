// pdfExtractor.js
// Simple PDF text extractor using pdf-parse

const fs = require("fs");
const pdfParse = require("pdf-parse");

/**
 * Extract raw text from PDF file.
 * @param {string} filePath
 * @returns {Promise<string>}
 */
async function extractTextFromPDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    return pdfData.text || "";
  } catch (err) {
    console.error("PDF Extraction Error:", err);
    throw new Error("Failed to extract text from PDF");
  }
}

module.exports = { extractTextFromPDF };
