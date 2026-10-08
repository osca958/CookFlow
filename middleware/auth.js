const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const [tipo, token] = (req.headers.authorization || '').split(' ');

    if (tipo !== 'Bearer' || !token) {
        return res.status(401).json({ error: 'Token requerido' });
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = { USid: payload.USid };   // lo usarán los controllers
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token inválido o caducado' });
    }
};