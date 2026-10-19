const router = require('express').Router();
const c = require('../controllers/favoritosController');
const auth = require('../middleware/auth');

router.use(auth);   

router.get('/', c.getFavoritos);
router.post('/:RECid', c.insertFavorito);
router.delete('/:RECid', c.deleteFavorito);

module.exports = router;