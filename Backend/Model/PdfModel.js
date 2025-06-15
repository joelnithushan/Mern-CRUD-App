const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pdfSchema = new Schema({
  pdf: { type: String, required: true },
  title: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("PdfDetails", pdfSchema);
