const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddleware')
const { getData } = require("../controllers/dataController")
router.get('/analytics' , protect, getData)
module.exports = router;