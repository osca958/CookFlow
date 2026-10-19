const router = require('express').Router();
const c = require('../controllers/categoriasController');
const auth = require('../middleware/auth');

router.get('/', c.getCategorias);
router.get('/:id', c.getCategoriaById);

router.post('/', auth, c.insertCategoria);
router.put('/:id', auth, c.updateCategoria);
router.delete('/:id', auth, c.deleteCategoria);

module.exports = router;