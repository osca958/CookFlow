const router = require('express').Router();
const c = require('../controllers/restaurantesController');
const auth = require('../middleware/auth');

router.get('/', c.getRestaurantes);
router.get('/ranking', c.getRanking);        // antes que /:id
router.get('/:id', c.getRestauranteById);

router.post('/', auth, c.insertRestaurante);
router.put('/:id', auth, c.updateRestaurante);
router.delete('/:id', auth, c.deleteRestaurante);

module.exports = router;