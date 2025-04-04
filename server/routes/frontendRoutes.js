const express = require('express');
const router = express.Router();
const path = require('path');

// Serve HTML files
router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist', 'index.html'));
});

module.exports = router;