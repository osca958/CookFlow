const express = require('express');
const router = express.Router();
const controller = require('../controllers/ingredientesController');

router.get('/', controller.getIngredientes);

module.exports = router;
