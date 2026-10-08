require('dotenv').config();
const express = require('express');
const cors = require('cors');

const recetasRoutes = require('./routes/recetas');
const ingredientesRoutes = require('./routes/ingredientes');
const categoriasRoutes = require('./routes/categorias');
const restaurantesRoutes = require('./routes/restaurantes');
const usuariosRoutes = require('./routes/usuarios');
const visitasRoutes = require('./routes/visitas');
const favoritosRoutes = require('./routes/favoritos');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('API CookFlow funcionando'));

app.use('/recetas', recetasRoutes);
app.use('/ingredientes', ingredientesRoutes);
app.use('/categorias', categoriasRoutes);
app.use('/restaurantes', restaurantesRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/visitas', visitasRoutes);
app.use('/favoritos', favoritosRoutes);

app.listen(3000, () => {
    console.log('Servidor funcionando en http://localhost:3000');
});

