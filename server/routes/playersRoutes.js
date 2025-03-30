const express = require('express');
const router = express.Router();
const dataAccess = require('../data/DataAccess');

router.post('/players/store', async (req, res) => {
  const playerInfo = req.body;
  if (playerInfo && playerInfo.email && playerInfo.phone) {
    await dataAccess.playerRepository.save(playerInfo.email, playerInfo.phone);
    
    res.status(204);
  } else {
    res.status(404);
  }
});

router.get('/players', async (req, res) => {
  const players = await dataAccess.playerRepository.get()
  
  res.status(200).json({result: players})
});

module.exports = router;