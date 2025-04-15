const express = require('express');
const router = express.Router();
const { generateQuestions } = require('../controllers/evaluationController');

router.get('/generate-questions', (req, res) => {
  res.json({ message: 'Endpoint is active. Please use POST method with required skills and experience.' });
});

router.post('/generate-questions', generateQuestions);

module.exports = router; 