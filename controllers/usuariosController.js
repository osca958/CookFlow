const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const { getConnection } = require('../db/connection');
const { esIdValido, manejarError } = require('../db/helpers');

exports.registro = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;
        if (!nombre || !email || !password) {
            return res.status(400).json({ error: 'nombre, email y password son obligatorios' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
        }

        const pool = await getConnection();
        const existe = await pool.request().input('email', email).execute('SP_GetUsuarioByEmail');
        if (existe.recordset.length > 0) {
            return res.status(409).json({ error: 'Ya existe un usuario con ese email' });
        }

        const hash = await bcrypt.hash(password, 10);   // ~60 caracteres
        await pool.request()
            .input('nombre', nombre)
            .input('email', email)
            .input('password', hash)
            .execute('SP_InsertUsuario');

        res.status(201).json({ mensaje: 'Usuario registrado' });
    } catch (err) { manejarError(err, res, 'Error registrando usuario'); }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'email y password son obligatorios' });

        const pool = await getConnection();
        const r = await pool.request().input('email', email).execute('SP_GetUsuarioByEmail');
        const usuario = r.recordset[0];

        if (!usuario || !(await bcrypt.compare(password, usuario.USpassword))) {
            return res.status(401).json({ error: 'Email o contraseña incorrectos' });
        }

        const token = jwt.sign(
            { USid: usuario.USid },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES || '2h' }
        );

        const { USpassword, ...publico } = usuario;
        res.json({ usuario: publico, token });
    } catch (err) { manejarError(err, res, 'Error en el login'); }
};

exports.getUsuarios = async (req, res) => {
    try {
        const pool = await getConnection();
        const r = await pool.request().execute('SP_GetUsuarios');
        res.json(r.recordset);
    } catch (err) { manejarError(err, res, 'Error obteniendo usuarios'); }
};

exports.getUsuarioById = async (req, res) => {
    try {
        if (!esIdValido(req.params.id)) return res.status(400).json({ error: 'Id no válido' });
        const pool = await getConnection();
        const r = await pool.request().input('USid', req.params.id).execute('SP_GetUsuarioById');
        if (r.recordset.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(r.recordset[0]);
    } catch (err) { manejarError(err, res, 'Error obteniendo el usuario'); }
};

exports.updateUsuario = async (req, res) => {
    try {
        const { nombre, email } = req.body;
        if (!esIdValido(req.params.id) || !nombre || !email) return res.status(400).json({ error: 'Datos no válidos' });
        if (Number(req.params.id) !== req.usuario.USid) return res.status(403).json({ error: 'No puedes modificar a otro usuario' });

        const pool = await getConnection();
        const r = await pool.request()
            .input('USid', req.params.id)
            .input('nombre', nombre)
            .input('email', email)
            .execute('SP_UpdateUsuario');
        if (r.recordset[0].filas === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json({ mensaje: 'Usuario actualizado' });
    } catch (err) { manejarError(err, res, 'Error actualizando usuario'); }
};

exports.deleteUsuario = async (req, res) => {
    try {
        if (!esIdValido(req.params.id)) return res.status(400).json({ error: 'Id no válido' });
        if (Number(req.params.id) !== req.usuario.USid) return res.status(403).json({ error: 'No puedes eliminar a otro usuario' });

        const pool = await getConnection();
        const r = await pool.request().input('USid', req.params.id).execute('SP_DeleteUsuario');
        if (r.recordset[0].filas === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json({ mensaje: 'Usuario eliminado' });
    } catch (err) { manejarError(err, res, 'Error eliminando usuario'); }
};