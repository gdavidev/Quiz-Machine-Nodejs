const express = require('express');
const router = express.Router();
const dataAccess = require('../data/DataAccess');

router.post('/players/store', async (req, res) => {
  const playerInfo = req.body;
  if (playerInfo) {
    await dataAccess.playerRepository.save(playerInfo);
    
    res.status(204).send();
  } else {
    res.status(400).send();
  }
});

router.get('/players', async (req, res) => {
  const players = await dataAccess.playerRepository.get()
  
  res.status(200).json({result: players})
});

module.exports = router;