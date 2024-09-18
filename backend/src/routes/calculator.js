const express = require('express');
const multer = require('multer');
const { analyzeImage } = require('../utils/imageAnalyzer');

const router = express.Router();
const upload = multer();

router.post('', upload.single('image'), async (req, res) => {
    try {
        const image = req.file;
        
        console.log('Received image:', image.originalname);
        
        const responses = await analyzeImage(image.buffer);
        
        const data = responses.map(response => response);
        console.log('Response from analyzeImage:', data);
        
        res.json({ message: "Image processed", data, status: "success" });
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({ message: "Error processing image", error: error.message, status: "error" });
    }
});

module.exports = router;