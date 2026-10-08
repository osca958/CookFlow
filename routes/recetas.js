const express = require('express');
const router = express.Router();
const controller = require('../controllers/recetasController');


router.get('/', controller.getRecetas);
router.get('/categoria/:id', controller.getRecetasPorCategoria);
router.get('/:id', controller.getRecetaById);
router.post('/', controller.insertReceta);
router.put('/:id', controller.updateReceta);
router.delete('/:id', controller.deleteReceta);

router.get('/:id/ingredientes', controller.getIngredientesReceta);
router.post('/:id/ingredientes', controller.insertIngredienteReceta);
router.put('/:id/ingredientes/:INid', controller.updateIngredienteReceta);
router.delete('/:id/ingredientes/:INid', controller.deleteIngredienteReceta);

module.exports = router;