const express = require('express');
const multer = require('multer');
const { analyzeImage } = require('../utils/imageAnalyzer');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/calculate', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file uploaded' });
        }

        console.log('Received file:', req.file.originalname, 'Size:', req.file.size);

        const imageBuffer = req.file.buffer;
        const result = await analyzeImage(imageBuffer);

        res.json({ data: result });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
});

module.exports = router;