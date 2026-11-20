const router = require('express').Router();
const c = require('../controllers/restaurantesController');
const auth = require('../middleware/auth');
const soloAdmin = require('../middleware/soloAdmin');

router.get('/', c.getRestaurantes);
router.get('/ranking', c.getRanking);        // antes que /:id
router.get('/:id', c.getRestauranteById);

router.post('/', auth, soloAdmin, c.insertRestaurante);
router.put('/:id', auth, soloAdmin, c.updateRestaurante);
router.delete('/:id', auth, soloAdmin, c.deleteRestaurante);

module.exports = router;
