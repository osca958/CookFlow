const router = require('express').Router();
const c = require('../controllers/categoriasController');

router.get('/', c.getCategorias);
router.get('/:id', c.getCategoriaById);
router.post('/', c.insertCategoria);
router.put('/:id', c.updateCategoria);
router.delete('/:id', c.deleteCategoria);

module.exports = router;