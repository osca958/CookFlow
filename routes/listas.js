const router = require('express').Router();
const c = require('../controllers/listasController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', c.getListas);
router.post('/', c.insertLista);
router.get('/:id', c.getListaById);
router.delete('/:id', c.deleteLista);

router.post('/:id/items', c.insertItem);
router.put('/:id/items/:INid', c.updateItem);
router.delete('/:id/items/:INid', c.deleteItem);

router.post('/:id/receta/:RECid', c.addReceta);

module.exports = router;