const express = require('express');
const router = express.Router();
const dataAccess = require('../data/DataAccess');

router.post('/questions/store', async (req, res) => {
  const questionInfo = req.body;
  await dataAccess.questionRepository.save(questionInfo);
  
  res.status(204).send();
});

router.get('/questions', async (req, res) => {
  const questions = await dataAccess.questionRepository.get()
  
  res.status(200).json({result: questions});
});

router.delete('/questions/delete', async (req, res) => {
  await dataAccess.questionRepository.erase();
  
  res.status(204).send();
});

module.exports = router;