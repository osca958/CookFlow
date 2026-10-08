const express = require('express');
const cors = require('cors');

const recetasRoutes = require('./routes/recetas');


const app = express();
app.use(cors());
app.use(express.json());

app.use('/recetas', recetasRoutes);


app.listen(3000, () => {
    console.log("Servidor funcionando en http://localhost:3000");
});

