exports.esIdValido = (v) => Number.isInteger(Number(v)) && Number(v) > 0;

exports.manejarError = (err, res, mensaje) => {
    if (err.number === 547) {
        return res.status(409).json({ error: 'Operación no permitida: hay datos relacionados o la referencia no existe' });
    }
    if (err.number === 2627 || err.number === 2601) {
        return res.status(409).json({ error: 'Ya existe un registro igual' });
    }
    console.error(err);
    res.status(500).json({ error: mensaje });
};