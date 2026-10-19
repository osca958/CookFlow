const { getConnection } = require('../db/connection');
const { esIdValido, manejarError } = require('../db/helpers');


exports.getFavoritos = async (req, res) => {
    try {
        const pool = await getConnection();
        const r = await pool.request()
            .input('USid', req.usuario.USid)
            .execute('SP_GetFavoritosUsuario');
        res.json(r.recordset);
    } catch (err) { manejarError(err, res, 'Error obteniendo favoritos'); }
};


exports.insertFavorito = async (req, res) => {
    try {
        if (!esIdValido(req.params.RECid)) return res.status(400).json({ error: 'Id no válido' });
        const pool = await getConnection();
        await pool.request()
            .input('USid', req.usuario.USid)
            .input('RECid', req.params.RECid)
            .execute('SP_InsertFavorito');
        res.status(201).json({ mensaje: 'Receta añadida a favoritos' });
    } catch (err) { manejarError(err, res, 'Error añadiendo favorito'); }
};


exports.deleteFavorito = async (req, res) => {
    try {
        if (!esIdValido(req.params.RECid)) return res.status(400).json({ error: 'Id no válido' });
        const pool = await getConnection();
        const r = await pool.request()
            .input('USid', req.usuario.USid)
            .input('RECid', req.params.RECid)
            .execute('SP_DeleteFavorito');
        if (r.recordset[0].filas === 0) return res.status(404).json({ error: 'Esa receta no está en tus favoritos' });
        res.json({ mensaje: 'Receta eliminada de favoritos' });
    } catch (err) { manejarError(err, res, 'Error eliminando favorito'); }
};