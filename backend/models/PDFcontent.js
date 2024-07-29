// models/PDFcontent.js
const mongoose = require('mongoose');

const PDFChunkSchema = new mongoose.Schema({
    content: { type: String, required: true },
    pageNumber: { type: Number, required: true },
    chunkIndex: { type: Number, required: true }
});

const PDFContentSchema = new mongoose.Schema({
    fileName: { type: String, required: true },
    chunks: [PDFChunkSchema],
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PDFContent', PDFContentSchema);