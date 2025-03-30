const express = require('express');
const router = express.Router();
const dataAccess = require('../data/DataAccess');

router.post('/configuration/update', async (req, res) => {
  await dataAccess.configurationRepository.update(req.body);
  
  res.status(204);
});

router.get('/configuration', async (req, res) => {
  const config = await dataAccess.configurationRepository.get();
  
  res.status(200).json({result: config});
});

module.exports = router;