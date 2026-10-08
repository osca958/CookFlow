const router = require('express').Router();
const c = require('../controllers/usuariosController');
const auth = require('../middleware/auth');

router.post('/registro', c.registro);
router.post('/login', c.login);
router.get('/', auth, c.getUsuarios);
router.get('/:id', auth, c.getUsuarioById);
router.put('/:id', auth, c.updateUsuario);
router.delete('/:id', auth, c.deleteUsuario);

module.exports = router;