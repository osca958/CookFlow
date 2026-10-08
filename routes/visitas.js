const router = require('express').Router();
const c = require('../controllers/visitasController');

router.get('/usuario/:USid', c.getVisitasUsuario);
router.post('/', c.insertVisita);
router.put('/:USid/:RESid', c.updateVisita);
router.delete('/:USid/:RESid', c.deleteVisita);

module.exports = router;