const { getConnection } = require('../db/connection');
const { esIdValido, manejarError } = require('../db/helpers');

exports.getIngredientes = async (req, res) => {
    try {
        const pool = await getConnection();
        const r = await pool.request()
            .input('buscar', req.query.buscar || null)
            .execute('SP_GetIngredientes');
        res.json(r.recordset);
    } catch (err) { manejarError(err, res, 'Error obteniendo ingredientes'); }
};

exports.getIngredienteById = async (req, res) => {
    try {
        if (!esIdValido(req.params.id)) return res.status(400).json({ error: 'Id no válido' });
        const pool = await getConnection();
        const r = await pool.request().input('INid', req.params.id).execute('SP_GetIngredienteById');
        if (r.recordset.length === 0) return res.status(404).json({ error: 'Ingrediente no encontrado' });
        res.json(r.recordset[0]);
    } catch (err) { manejarError(err, res, 'Error obteniendo el ingrediente'); }
};

exports.insertIngrediente = async (req, res) => {
    try {
        const { nombre } = req.body;
        if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' });
        const pool = await getConnection();
        const r = await pool.request().input('nombre', nombre).execute('SP_InsertIngrediente');
        res.status(201).json({ id: r.recordset[0].id, mensaje: 'Ingrediente creado' });
    } catch (err) { manejarError(err, res, 'Error creando ingrediente'); }
};

exports.updateIngrediente = async (req, res) => {
    try {
        const { nombre } = req.body;
        if (!esIdValido(req.params.id) || !nombre) return res.status(400).json({ error: 'Datos no válidos' });
        const pool = await getConnection();
        const r = await pool.request()
            .input('INid', req.params.id)
            .input('nombre', nombre)
            .execute('SP_UpdateIngrediente');
        if (r.recordset[0].filas === 0) return res.status(404).json({ error: 'Ingrediente no encontrado' });
        res.json({ mensaje: 'Ingrediente actualizado' });
    } catch (err) { manejarError(err, res, 'Error actualizando ingrediente'); }
};

exports.deleteIngrediente = async (req, res) => {
    try {
        if (!esIdValido(req.params.id)) return res.status(400).json({ error: 'Id no válido' });
        const pool = await getConnection();
        const r = await pool.request().input('INid', req.params.id).execute('SP_DeleteIngrediente');
        if (r.recordset[0].filas === 0) return res.status(404).json({ error: 'Ingrediente no encontrado' });
        res.json({ mensaje: 'Ingrediente eliminado' });
    } catch (err) { manejarError(err, res, 'Error eliminando ingrediente'); }
};