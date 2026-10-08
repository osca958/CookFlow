const express = require('express');
const router = express.Router();
const controller = require('../controllers/recetasController');

// Todas las recetas
router.get('/', controller.getRecetas);

// Ingredientes de una receta
router.get('/:id/ingredientes', controller.getIngredientesReceta);

// Recetas por categoría
router.get('/categoria/:id', controller.getRecetasPorCategoria);

// Crear receta
router.post('/', controller.insertReceta);

// Añadir ingrediente a receta
router.post('/:id/ingredientes', controller.insertIngredienteReceta);

module.exports = router;
