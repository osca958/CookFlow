const { getConnection } = require('../db/connection');

exports.getIngredientes = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().execute('SP_GetIngredientes');
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error obteniendo ingredientes");
    }
};
