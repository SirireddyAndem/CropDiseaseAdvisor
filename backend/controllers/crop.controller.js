const Analysis = require('../models/Analysis.model');

// Mock disease database including rice
const diseaseDB = {
  "tomato": {
    "spots_on_leaves": {
      name: "Bacterial Spot",
      cause: "Caused by Xanthomonas bacteria, thrives in warm, wet conditions.",
      treatment: "Apply copper-based fungicides. Remove and destroy infected plant parts. Ensure good air circulation."
    }
  },
  "potato": {
    "brown_lesions": {
      name: "Late Blight",
      cause: "Caused by the oomycete Phytophthora infestans.",
      treatment: "Apply fungicides preventively. Ensure proper spacing for airflow. Water at the base of the plant to keep foliage dry."
    }
  },
  "rice": {
    "brown_lesions": {
        name: "Brown Spot",
        cause: "Caused by the fungus Bipolaris oryzae, often due to nutrient-deficient soil or water stress.",
        treatment: "Ensure balanced nutrient application, manage water levels properly, and use resistant varieties. Fungicides like Mancozeb can be effective."
    },
    "spots_on_leaves": {
        name: "Leaf Blast",
        cause: "Caused by the fungus Pyricularia oryzae, favored by high humidity and nitrogen levels.",
        treatment: "Use resistant cultivars, manage nitrogen fertilizer application, and apply fungicides like Tricyclazole at the first sign of disease."
    }
  }
};

// Simple rule-based disease identification
const identifyDisease = (cropType, symptoms, imagePath) => {
  const lowerCropType = cropType.toLowerCase();
  if (diseaseDB[lowerCropType] && diseaseDB[lowerCropType][symptoms]) {
    return diseaseDB[lowerCropType][symptoms];
  }
  return {
    name: "Unknown Disease",
    cause: "Could not identify based on provided symptoms. Please consult a local expert.",
    treatment: "Ensure good plant hygiene and proper watering."
  };
};

exports.analyzeCrop = async (req, res) => {
  const { cropType, symptoms } = req.body;
  const imagePath = req.file ? req.file.path : null;
  const userId = req.user.id;

  try {
    const identifiedDisease = identifyDisease(cropType, symptoms, imagePath);

    const analysis = new Analysis({
      user: userId,
      cropType,
      symptoms,
      imagePath,
      disease: identifiedDisease
    });

    await analysis.save();
    res.json(analysis);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getReports = async (req, res) => {
    try {
        const reports = await Analysis.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(reports);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};