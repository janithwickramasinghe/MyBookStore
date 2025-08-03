// In Routes/UploadRoutes.js (or BookRoutes.js)
const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/CloudinaryConfig'); // your cloudinary multer setup

router.post('/', upload.single('bookImage'), (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  
      res.json({
        url: req.file.path,
        public_id: req.file.filename,
      });
    } catch (err) {
      console.error('Upload error:', err);
      res.status(500).json({ error: 'Upload failed' });
    }
  });
  
module.exports = router;
