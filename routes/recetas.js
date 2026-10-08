const express = require('express');
const router = express.Router();
const controller = require('../controllers/recetasController');
const auth = require('../middleware/auth');


router.get('/', controller.getRecetas);
router.get('/categoria/:id', controller.getRecetasPorCategoria);
router.get('/:id', controller.getRecetaById);
router.get('/:id/ingredientes', controller.getIngredientesReceta);


router.post('/', auth, controller.insertReceta);
router.put('/:id', auth, controller.updateReceta);
router.delete('/:id', auth, controller.deleteReceta);
router.post('/:id/ingredientes', auth, controller.insertIngredienteReceta);
router.put('/:id/ingredientes/:INid', auth, controller.updateIngredienteReceta);
router.delete('/:id/ingredientes/:INid', auth, controller.deleteIngredienteReceta);

module.exports = router;