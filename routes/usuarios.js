const router = require('express').Router();
const c = require('../controllers/usuariosController');

router.post('/registro', c.registro);
router.post('/login', c.login);
router.get('/', c.getUsuarios);
router.get('/:id', c.getUsuarioById);
router.put('/:id', c.updateUsuario);
router.delete('/:id', c.deleteUsuario);

module.exports = router;