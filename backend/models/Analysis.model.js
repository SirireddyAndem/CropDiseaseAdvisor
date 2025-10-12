const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cropType: { type: String, required: true },
  imagePath: { type: String }, // Path to uploaded image
  symptoms: { type: String }, // Manually entered symptoms
  disease: {
    name: String,
    cause: String,
    treatment: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Analysis', AnalysisSchema);