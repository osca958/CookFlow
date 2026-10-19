const { getConnection } = require('../db/connection');
const { esIdValido, manejarError } = require('../db/helpers');

const paxValido = (p) => Number.isInteger(Number(p)) && Number(p) >= 1 && Number(p) <= 50;

exports.getListas = async (req, res) => {
    try {
        const pool = await getConnection();
        const r = await pool.request().input('USid', req.usuario.USid).execute('SP_GetListasUsuario');
        res.json(r.recordset);
    } catch (err) { manejarError(err, res, 'Error obteniendo listas'); }
};

exports.insertLista = async (req, res) => {
    try {
        const { pax } = req.body || {};
        const paxFinal = pax == null ? 1 : pax;
        if (!paxValido(paxFinal)) return res.status(400).json({ error: 'pax debe ser un entero entre 1 y 50' });
        const pool = await getConnection();
        const r = await pool.request()
            .input('USid', req.usuario.USid)
            .input('pax', paxFinal)
            .execute('SP_InsertLista');
        res.status(201).json({ id: r.recordset[0].id, mensaje: 'Lista creada' });
    } catch (err) { manejarError(err, res, 'Error creando lista'); }
};

exports.getListaById = async (req, res) => {
    try {
        if (!esIdValido(req.params.id)) return res.status(400).json({ error: 'Id no válido' });
        const pool = await getConnection();
        const cab = await pool.request()
            .input('LCid', req.params.id).input('USid', req.usuario.USid)
            .execute('SP_GetListaById');
        if (cab.recordset.length === 0) return res.status(404).json({ error: 'Lista no encontrada' });
        const items = await pool.request()
            .input('LCid', req.params.id).input('USid', req.usuario.USid)
            .execute('SP_GetItemsLista');
        res.json({ ...cab.recordset[0], items: items.recordset });
    } catch (err) { manejarError(err, res, 'Error obteniendo la lista'); }
};

exports.deleteLista = async (req, res) => {
    try {
        if (!esIdValido(req.params.id)) return res.status(400).json({ error: 'Id no válido' });
        const pool = await getConnection();
        const r = await pool.request()
            .input('LCid', req.params.id).input('USid', req.usuario.USid)
            .execute('SP_DeleteLista');
        if (r.recordset[0].filas === 0) return res.status(404).json({ error: 'Lista no encontrada' });
        res.json({ mensaje: 'Lista eliminada' });
    } catch (err) { manejarError(err, res, 'Error eliminando lista'); }
};

exports.insertItem = async (req, res) => {
    try {
        const { INid, cantidad, unidad } = req.body || {};
        if (!esIdValido(req.params.id) || !esIdValido(INid) || cantidad == null || Number(cantidad) <= 0) {
            return res.status(400).json({ error: 'INid y cantidad (mayor que 0) son obligatorios' });
        }
        const pool = await getConnection();
        const r = await pool.request()
            .input('LCid', req.params.id).input('USid', req.usuario.USid)
            .input('INid', INid).input('cantidad', cantidad).input('unidad', unidad)
            .execute('SP_UpsertItemLista');
        if (r.recordset[0].ok === 0) return res.status(404).json({ error: 'Lista no encontrada' });
        res.status(201).json({ mensaje: 'Ingrediente añadido a la lista' });
    } catch (err) { manejarError(err, res, 'Error añadiendo ingrediente'); }
};

exports.updateItem = async (req, res) => {
    try {
        const { cantidad, unidad } = req.body || {};
        const { id, INid } = req.params;
        if (!esIdValido(id) || !esIdValido(INid) || cantidad == null || Number(cantidad) <= 0) {
            return res.status(400).json({ error: 'Datos no válidos' });
        }
        const pool = await getConnection();
        const r = await pool.request()
            .input('LCid', id).input('USid', req.usuario.USid).input('INid', INid)
            .input('cantidad', cantidad).input('unidad', unidad)
            .execute('SP_UpdateItemLista');
        if (r.recordset[0].filas === 0) return res.status(404).json({ error: 'Ese ingrediente no está en tu lista' });
        res.json({ mensaje: 'Ingrediente actualizado' });
    } catch (err) { manejarError(err, res, 'Error actualizando ingrediente'); }
};

exports.deleteItem = async (req, res) => {
    try {
        const { id, INid } = req.params;
        if (!esIdValido(id) || !esIdValido(INid)) return res.status(400).json({ error: 'Datos no válidos' });
        const pool = await getConnection();
        const r = await pool.request()
            .input('LCid', id).input('USid', req.usuario.USid).input('INid', INid)
            .execute('SP_DeleteItemLista');
        if (r.recordset[0].filas === 0) return res.status(404).json({ error: 'Ese ingrediente no está en tu lista' });
        res.json({ mensaje: 'Ingrediente eliminado de la lista' });
    } catch (err) { manejarError(err, res, 'Error eliminando ingrediente'); }
};

exports.addReceta = async (req, res) => {
    try {
        const { id, RECid } = req.params;
        if (!esIdValido(id) || !esIdValido(RECid)) return res.status(400).json({ error: 'Datos no válidos' });
        const pool = await getConnection();
        const r = await pool.request()
            .input('LCid', id).input('USid', req.usuario.USid).input('RECid', RECid)
            .execute('SP_AddRecetaALista');
        const ok = r.recordset[0].ok;
        if (ok === 0) return res.status(404).json({ error: 'Lista no encontrada' });
        if (ok === -1) return res.status(404).json({ error: 'Receta no encontrada' });
        res.status(201).json({ mensaje: 'Ingredientes de la receta añadidos a la lista' });
    } catch (err) { manejarError(err, res, 'Error añadiendo la receta a la lista'); }
};