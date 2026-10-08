const router = require('express').Router();
const c = require('../controllers/ingredientesController');
const auth = require('../middleware/auth');

router.get('/', c.getIngredientes);
router.get('/:id', c.getIngredienteById);

router.post('/', auth, c.insertIngrediente);
router.put('/:id', auth, c.updateIngrediente);
router.delete('/:id', auth, c.deleteIngrediente);

module.exports = router;