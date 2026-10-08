const router = require('express').Router();
const c = require('../controllers/ingredientesController');

router.get('/', c.getIngredientes);
router.get('/:id', c.getIngredienteById);
router.post('/', c.insertIngrediente);
router.put('/:id', c.updateIngrediente);
router.delete('/:id', c.deleteIngrediente);

module.exports = router;