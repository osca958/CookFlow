const router = require('express').Router();
const c = require('../controllers/visitasController');
const auth = require('../middleware/auth');

router.use(auth);   // todas las rutas de visitas requieren login

router.get('/', c.getVisitasUsuario);
router.post('/', c.insertVisita);
router.put('/:RESid', c.updateVisita);
router.delete('/:RESid', c.deleteVisita);

module.exports = router;