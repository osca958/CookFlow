const { getConnection } = require('../db/connection');
const { esIdValido, manejarError } = require('../db/helpers');

exports.getRestaurantes = async (req, res) => {
    try {
        const pool = await getConnection();
        const r = await pool.request().execute('SP_GetRestaurantes');
        res.json(r.recordset);
    } catch (err) { manejarError(err, res, 'Error obteniendo restaurantes'); }
};

exports.getRanking = async (req, res) => {
    try {
        const pool = await getConnection();
        const r = await pool.request().execute('SP_GetRankingRestaurantes');
        res.json(r.recordset);
    } catch (err) { manejarError(err, res, 'Error obteniendo el ranking'); }
};

exports.getRestauranteById = async (req, res) => {
    try {
        if (!esIdValido(req.params.id)) return res.status(400).json({ error: 'Id no válido' });
        const pool = await getConnection();
        const r = await pool.request().input('RESid', req.params.id).execute('SP_GetRestauranteById');
        if (r.recordset.length === 0) return res.status(404).json({ error: 'Restaurante no encontrado' });
        res.json(r.recordset[0]);
    } catch (err) { manejarError(err, res, 'Error obteniendo el restaurante'); }
};

exports.insertRestaurante = async (req, res) => {
    try {
        const { nombre, direccion, tipo } = req.body;
        if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' });
        const pool = await getConnection();
        const r = await pool.request()
            .input('nombre', nombre)
            .input('direccion', direccion)
            .input('tipo', tipo)
            .execute('SP_InsertRestaurante');
        res.status(201).json({ id: r.recordset[0].id, mensaje: 'Restaurante creado' });
    } catch (err) { manejarError(err, res, 'Error creando restaurante'); }
};

exports.updateRestaurante = async (req, res) => {
    try {
        const { nombre, direccion, tipo } = req.body;
        if (!esIdValido(req.params.id) || !nombre) return res.status(400).json({ error: 'Datos no válidos' });
        const pool = await getConnection();
        const r = await pool.request()
            .input('RESid', req.params.id)
            .input('nombre', nombre)
            .input('direccion', direccion)
            .input('tipo', tipo)
            .execute('SP_UpdateRestaurante');
        if (r.recordset[0].filas === 0) return res.status(404).json({ error: 'Restaurante no encontrado' });
        res.json({ mensaje: 'Restaurante actualizado' });
    } catch (err) { manejarError(err, res, 'Error actualizando restaurante'); }
};

exports.deleteRestaurante = async (req, res) => {
    try {
        if (!esIdValido(req.params.id)) return res.status(400).json({ error: 'Id no válido' });
        const pool = await getConnection();
        const r = await pool.request().input('RESid', req.params.id).execute('SP_DeleteRestaurante');
        if (r.recordset[0].filas === 0) return res.status(404).json({ error: 'Restaurante no encontrado' });
        res.json({ mensaje: 'Restaurante eliminado' });
    } catch (err) { manejarError(err, res, 'Error eliminando restaurante'); }
};