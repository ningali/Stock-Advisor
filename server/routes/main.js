const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

// Routes
router.get('/', stockController.viewMain);
router.post('/', stockController.find);
router.get('/viewallstocks', stockController.viewAllStocks);
router.get('/viewStock/:ticker', stockController.viewStock);
router.get('/quiz', stockController.viewForm);
router.post('/quizSearch', stockController.viewResults);

router.get('/learnmore', stockController.viewLearnMore);
router.get('/learnmore/q1', stockController.q1);
router.get('/learnmore/q2', stockController.q2);
router.get('/learnmore/q3', stockController.q3);

module.exports = router;