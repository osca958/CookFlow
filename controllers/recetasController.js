const { getConnection } = require('../db/connection');

// GET /recetas
exports.getRecetas = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().execute('SP_GetRecetas');
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error obteniendo recetas");
    }
};

// GET /recetas/:id/ingredientes
exports.getIngredientesReceta = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('RECid', req.params.id)
            .execute('SP_GetIngredientesReceta');
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error obteniendo ingredientes de la receta");
    }
};

// GET /recetas/categoria/:id
exports.getRecetasPorCategoria = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('CAid', req.params.id)
            .execute('SP_GetRecetasPorCategoria');
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error obteniendo recetas por categoría");
    }
};

// POST /recetas
exports.insertReceta = async (req, res) => {
    try {
        const { titulo, descripcion, imagen, tiempo, dificultad, USid, CAid } = req.body;

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

        res.send("Receta insertada correctamente");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error insertando receta");
    }
};

// POST /recetas/:id/ingredientes
exports.insertIngredienteReceta = async (req, res) => {
    try {
        const RECid = req.params.id;
        const { INid, cantidad, unidad } = req.body;

        const pool = await getConnection();
        await pool.request()
            .input('RECid', RECid)
            .input('INid', INid)
            .input('cantidad', cantidad)
            .input('unidad', unidad)
            .execute('SP_InsertIngredienteReceta');

        res.send("Ingrediente añadido a la receta");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error insertando ingrediente en receta");
    }
};

