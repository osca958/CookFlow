const { getConnection } = require('../db/connection');
const { esIdValido, manejarError } = require('../db/helpers');

const puntuacionValida = (p) => p == null || (Number.isInteger(Number(p)) && p >= 1 && p <= 5);

exports.getVisitasUsuario = async (req, res) => {
    try {
        if (!esIdValido(req.params.USid)) return res.status(400).json({ error: 'Id no válido' });
        const pool = await getConnection();
        const r = await pool.request().input('USid', req.params.USid).execute('SP_GetVisitasUsuario');
        res.json(r.recordset);
    } catch (err) { manejarError(err, res, 'Error obteniendo visitas'); }
};

exports.insertVisita = async (req, res) => {
    try {
        const { USid, RESid, puntuacion, comentario } = req.body;
        if (!esIdValido(USid) || !esIdValido(RESid) || !puntuacionValida(puntuacion)) {
            return res.status(400).json({ error: 'USid y RESid son obligatorios; puntuacion entre 1 y 5' });
        }
        const pool = await getConnection();
        await pool.request()
            .input('USid', USid)
            .input('RESid', RESid)
            .input('puntuacion', puntuacion)
            .input('comentario', comentario)
            .execute('SP_InsertVisita');
        res.status(201).json({ mensaje: 'Visita registrada' });
    } catch (err) { manejarError(err, res, 'Error registrando visita'); }
};


exports.updateVisita = async (req, res) => {
    try {
        const { USid, RESid } = req.params;
        const { puntuacion, comentario } = req.body;
        if (!esIdValido(USid) || !esIdValido(RESid) || !puntuacionValida(puntuacion)) {
            return res.status(400).json({ error: 'Datos no válidos' });
        }
        const pool = await getConnection();
        const r = await pool.request()
            .input('USid', USid)
            .input('RESid', RESid)
            .input('puntuacion', puntuacion)
            .input('comentario', comentario)
            .execute('SP_UpdateVisita');
        if (r.recordset[0].filas === 0) return res.status(404).json({ error: 'Visita no encontrada' });
        res.json({ mensaje: 'Visita actualizada' });
    } catch (err) { manejarError(err, res, 'Error actualizando visita'); }
};


exports.deleteVisita = async (req, res) => {
    try {
        const { USid, RESid } = req.params;
        if (!esIdValido(USid) || !esIdValido(RESid)) return res.status(400).json({ error: 'Datos no válidos' });
        const pool = await getConnection();
        const r = await pool.request()
            .input('USid', USid)
            .input('RESid', RESid)
            .execute('SP_DeleteVisita');
        if (r.recordset[0].filas === 0) return res.status(404).json({ error: 'Visita no encontrada' });
        res.json({ mensaje: 'Visita eliminada' });
    } catch (err) { manejarError(err, res, 'Error eliminando visita'); }
};