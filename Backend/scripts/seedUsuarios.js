require('dotenv').config();
const bcrypt = require('bcryptjs');
const { getConnection } = require('../db/connection');

const usuarios = [
    { nombre: 'CookFlow',  email: 'cookflow@cookflow.com', password: 'CookFlow2026!' },
    { nombre: 'Marta Ruiz', email: 'marta@demo.com',        password: 'demo1234' },
    { nombre: 'Luis Pérez', email: 'luis@demo.com',         password: 'demo1234' },
    { nombre: 'Carla Gómez', email: 'carla@demo.com',       password: 'demo1234' },
    { nombre: 'Pablo Díaz', email: 'pablo@demo.com',        password: 'demo1234' },
];

(async () => {
    try {
        const pool = await getConnection();
        for (const u of usuarios) {
            const existe = await pool.request().input('email', u.email).execute('SP_GetUsuarioByEmail');
            if (existe.recordset.length > 0) {
                console.log('Ya existe:', u.email);
                continue;
            }
            const hash = await bcrypt.hash(u.password, 10);
            await pool.request()
                .input('nombre', u.nombre)
                .input('email', u.email)
                .input('password', hash)
                .execute('SP_InsertUsuario');
            console.log('Creado:', u.email);
        }
    } catch (err) {
        console.error(err);
    } finally {
        process.exit(0);
    }
})();