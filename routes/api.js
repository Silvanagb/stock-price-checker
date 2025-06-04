const express = require('express');
const router = express.Router();
const stockHandler = require('../controllers/stockHandler.js');

router.get('/stock-prices', stockHandler.handleStock);

module.exports = router;