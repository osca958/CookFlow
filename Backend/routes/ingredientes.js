const router = require('express').Router();
const c = require('../controllers/ingredientesController');
const auth = require('../middleware/auth');
const soloAdmin = require('../middleware/soloAdmin');

router.get('/', c.getIngredientes);
router.get('/:id', c.getIngredienteById);

router.post('/', auth, soloAdmin, c.insertIngrediente);
router.put('/:id', auth, soloAdmin, c.updateIngrediente);
router.delete('/:id', auth, soloAdmin, c.deleteIngrediente);

module.exports = router;