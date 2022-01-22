const express = require('express');
const router = express.Router();
var cors = require('cors')

const trade = require('./routes/trade');
const portfolio = require('./routes/portfolio');

// Add json and urlencoded middleware
router.use(cors())
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use('/trade', trade);
router.use('/portfolio',portfolio);

module.exports = router;