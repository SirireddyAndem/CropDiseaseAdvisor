const Analysis = require('../models/Analysis.model');
const diseaseDB = {
  "tomato": { "spots_on_leaves": { name: "Bacterial Spot", cause: "Xanthomonas bacteria.", treatment: "Apply copper fungicides." } },
  "potato": { "brown_lesions": { name: "Late Blight", cause: "Phytophthora infestans.", treatment: "Apply fungicides preventively." } },
  "rice": {
    "brown_lesions": { name: "Brown Spot", cause: "Bipolaris oryzae fungus.", treatment: "Ensure balanced nutrient application." },
    "spots_on_leaves": { name: "Leaf Blast", cause: "Pyricularia oryzae fungus.", treatment: "Use resistant cultivars." }
  }
};

const identifyDisease = (cropType, symptoms) => {
  const lowerCropType = cropType.toLowerCase();
  if (diseaseDB[lowerCropType] && diseaseDB[lowerCropType][symptoms]) {
    return diseaseDB[lowerCropType][symptoms];
  }
  return { name: "Unknown Disease", cause: "Could not identify based on symptoms.", treatment: "Consult a local expert." };
};

exports.analyzeCrop = async (req, res) => {
  const { cropType, symptoms } = req.body;
  const imagePath = req.file ? req.file.path : null;
  const userId = req.user.id;
  try {
    const identifiedDisease = identifyDisease(cropType, symptoms);
    const analysis = new Analysis({ user: userId, cropType, symptoms, imagePath, disease: identifiedDisease });
    await analysis.save();
    res.json(analysis);
  } catch (err) {
    console.error('Error in analyzeCrop:', err);
    res.status(500).send('Server Error');
  }
};

exports.getReports = async (req, res) => {
  try {
    const reports = await Analysis.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    console.error('Error in getReports:', err);
    res.status(500).send('Server Error');
  }
};
