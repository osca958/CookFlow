const { getConnection } = require('../db/connection');
const { esIdValido, manejarError } = require('../db/helpers');

exports.getCategorias = async (req, res) => {
    try {
        const pool = await getConnection();
        const r = await pool.request().execute('SP_GetCategorias');
        res.json(r.recordset);
    } catch (err) { manejarError(err, res, 'Error obteniendo categorías'); }
};

exports.getCategoriaById = async (req, res) => {
    try {
        if (!esIdValido(req.params.id)) return res.status(400).json({ error: 'Id no válido' });
        const pool = await getConnection();
        const r = await pool.request().input('CAid', req.params.id).execute('SP_GetCategoriaById');
        if (r.recordset.length === 0) return res.status(404).json({ error: 'Categoría no encontrada' });
        res.json(r.recordset[0]);
    } catch (err) { manejarError(err, res, 'Error obteniendo la categoría'); }
};

exports.insertCategoria = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' });
        const pool = await getConnection();
        const r = await pool.request()
            .input('nombre', nombre)
            .input('descripcion', descripcion)
            .execute('SP_InsertCategoria');
        res.status(201).json({ id: r.recordset[0].id, mensaje: 'Categoría creada' });
    } catch (err) { manejarError(err, res, 'Error creando categoría'); }
};

exports.updateCategoria = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        if (!esIdValido(req.params.id) || !nombre) return res.status(400).json({ error: 'Datos no válidos' });
        const pool = await getConnection();
        const r = await pool.request()
            .input('CAid', req.params.id)
            .input('nombre', nombre)
            .input('descripcion', descripcion)
            .execute('SP_UpdateCategoria');
        if (r.recordset[0].filas === 0) return res.status(404).json({ error: 'Categoría no encontrada' });
        res.json({ mensaje: 'Categoría actualizada' });
    } catch (err) { manejarError(err, res, 'Error actualizando categoría'); }
};

exports.deleteCategoria = async (req, res) => {
    try {
        if (!esIdValido(req.params.id)) return res.status(400).json({ error: 'Id no válido' });
        const pool = await getConnection();
        const r = await pool.request().input('CAid', req.params.id).execute('SP_DeleteCategoria');
        if (r.recordset[0].filas === 0) return res.status(404).json({ error: 'Categoría no encontrada' });
        res.json({ mensaje: 'Categoría eliminada' });
    } catch (err) { manejarError(err, res, 'Error eliminando categoría'); }
};