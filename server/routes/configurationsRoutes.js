const express = require('express');
const router = express.Router();
const dataAccess = require('../data/DataAccess');

router.put('/configuration/update', async (req, res) => {
  await dataAccess.configurationRepository.update(req.body);
  
  res.status(204).send();
});

router.get('/configuration', async (req, res) => {
  const config = await dataAccess.configurationRepository.get();
  
  res.status(200).json({result: config});
});

module.exports = router;