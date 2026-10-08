const { getConnection } = require('../db/connection');
const { esIdValido, manejarError } = require('../db/helpers');

exports.getRecetas = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().execute('SP_GetRecetas');
        res.json(result.recordset);
    } catch (err) { manejarError(err, res, 'Error obteniendo recetas'); }
};

exports.getRecetaById = async (req, res) => {
    try {
        if (!esIdValido(req.params.id)) return res.status(400).json({ error: 'Id no válido' });
        const pool = await getConnection();
        const result = await pool.request()
            .input('RECid', req.params.id)
            .execute('SP_GetRecetaById');
        if (result.recordset.length === 0) return res.status(404).json({ error: 'Receta no encontrada' });
        res.json(result.recordset[0]);
    } catch (err) { manejarError(err, res, 'Error obteniendo la receta'); }
};

exports.getIngredientesReceta = async (req, res) => {
    try {
        if (!esIdValido(req.params.id)) return res.status(400).json({ error: 'Id no válido' });
        const pool = await getConnection();
        const result = await pool.request()
            .input('RECid', req.params.id)
            .execute('SP_GetIngredientesReceta');
        res.json(result.recordset);
    } catch (err) { manejarError(err, res, 'Error obteniendo ingredientes de la receta'); }
};

exports.getRecetasPorCategoria = async (req, res) => {
    try {
        if (!esIdValido(req.params.id)) return res.status(400).json({ error: 'Id no válido' });
        const pool = await getConnection();
        const result = await pool.request()
            .input('CAid', req.params.id)
            .execute('SP_GetRecetasPorCategoria');
        res.json(result.recordset);
    } catch (err) { manejarError(err, res, 'Error obteniendo recetas por categoría'); }
};

exports.insertReceta = async (req, res) => {
    try {
        const { titulo, descripcion, imagen, tiempo, dificultad, USid, CAid } = req.body;
        if (!titulo || !esIdValido(USid) || !esIdValido(CAid)) {
            return res.status(400).json({ error: 'Faltan datos: titulo, USid y CAid son obligatorios' });
        }
        const pool = await getConnection();
        await pool.request()
            .input('titulo', titulo)
            .input('descripcion', descripcion)
            .input('imagen', imagen)
            .input('tiempo', tiempo)
            .input('dificultad', dificultad)
            .input('USid', USid)
            .input('CAid', CAid)
            .execute('SP_InsertReceta');
        res.status(201).json({ mensaje: 'Receta insertada correctamente' });
    } catch (err) { manejarError(err, res, 'Error insertando receta'); }
};

exports.updateReceta = async (req, res) => {
    try {
        if (!esIdValido(req.params.id)) return res.status(400).json({ error: 'Id no válido' });
        const { titulo, descripcion, imagen, tiempo, dificultad, CAid } = req.body;
        if (!titulo || !esIdValido(CAid)) {
            return res.status(400).json({ error: 'Faltan datos: titulo y CAid son obligatorios' });
        }
        const pool = await getConnection();
        const result = await pool.request()
            .input('RECid', req.params.id)
            .input('titulo', titulo)
            .input('descripcion', descripcion)
            .input('imagen', imagen)
            .input('tiempo', tiempo)
            .input('dificultad', dificultad)
            .input('CAid', CAid)
            .execute('SP_UpdateReceta');
        if (result.recordset[0].filas === 0) return res.status(404).json({ error: 'Receta no encontrada' });
        res.json({ mensaje: 'Receta actualizada correctamente' });
    } catch (err) { manejarError(err, res, 'Error actualizando receta'); }
};

exports.deleteReceta = async (req, res) => {
    try {
        if (!esIdValido(req.params.id)) return res.status(400).json({ error: 'Id no válido' });
        const pool = await getConnection();
        const result = await pool.request()
            .input('RECid', req.params.id)
            .execute('SP_DeleteReceta');
        if (result.recordset[0].filas === 0) return res.status(404).json({ error: 'Receta no encontrada' });
        res.json({ mensaje: 'Receta eliminada correctamente' });
    } catch (err) { manejarError(err, res, 'Error eliminando receta'); }
};

exports.insertIngredienteReceta = async (req, res) => {
    try {
        const RECid = req.params.id;
        const { INid, cantidad, unidad } = req.body;
        if (!esIdValido(RECid) || !esIdValido(INid) || cantidad == null) {
            return res.status(400).json({ error: 'Faltan datos: INid y cantidad son obligatorios' });
        }
        const pool = await getConnection();
        await pool.request()
            .input('RECid', RECid)
            .input('INid', INid)
            .input('cantidad', cantidad)
            .input('unidad', unidad)
            .execute('SP_InsertIngredienteReceta');
        res.status(201).json({ mensaje: 'Ingrediente añadido a la receta' });
    } catch (err) { manejarError(err, res, 'Error insertando ingrediente en receta'); }
};

exports.updateIngredienteReceta = async (req, res) => {
    try {
        const { id, INid } = req.params;
        const { cantidad, unidad } = req.body;
        if (!esIdValido(id) || !esIdValido(INid) || cantidad == null) {
            return res.status(400).json({ error: 'Datos no válidos' });
        }
        const pool = await getConnection();
        const result = await pool.request()
            .input('RECid', id)
            .input('INid', INid)
            .input('cantidad', cantidad)
            .input('unidad', unidad)
            .execute('SP_UpdateIngredienteReceta');
        if (result.recordset[0].filas === 0) return res.status(404).json({ error: 'Ese ingrediente no está en la receta' });
        res.json({ mensaje: 'Ingrediente actualizado' });
    } catch (err) { manejarError(err, res, 'Error actualizando ingrediente de la receta'); }
};


exports.deleteIngredienteReceta = async (req, res) => {
    try {
        const { id, INid } = req.params;
        if (!esIdValido(id) || !esIdValido(INid)) return res.status(400).json({ error: 'Datos no válidos' });
        const pool = await getConnection();
        const result = await pool.request()
            .input('RECid', id)
            .input('INid', INid)
            .execute('SP_DeleteIngredienteReceta');
        if (result.recordset[0].filas === 0) return res.status(404).json({ error: 'Ese ingrediente no está en la receta' });
        res.json({ mensaje: 'Ingrediente eliminado de la receta' });
    } catch (err) { manejarError(err, res, 'Error eliminando ingrediente de la receta'); }
};