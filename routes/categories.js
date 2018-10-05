const express = require('express');
const router = express.Router();

const Factor = require('../models/Factor');

router.get('/', (req, res) => {
    
    res.send('categories');
});

module.exports = router;