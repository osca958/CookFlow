const router = require('express').Router();
const c = require('../controllers/restaurantesController');

router.get('/', c.getRestaurantes);
router.get('/ranking', c.getRanking);
router.get('/:id', c.getRestauranteById);
router.post('/', c.insertRestaurante);
router.put('/:id', c.updateRestaurante);
router.delete('/:id', c.deleteRestaurante);

module.exports = router;