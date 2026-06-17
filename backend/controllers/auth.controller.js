/*
  contiene la lógica de autenticación:
  - register: Toma el correo y contraseña, hashea la contraseña con bcrypt y la guarda en la BD.
  - login: Busca al usuario, compara los hashes con bcrypt y, si es correcto, genera un JWT que le da acceso al usuario.
*/

const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        if (!correo || !contrasena) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // verifica si el usuario ya existe
        const [existe] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        if (existe.length > 0) {
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        // hashea la contraseña (Salts = 10 es estándar seguro)
        const salt = await bcrypt.genSalt(10);
        const hashContrasena = await bcrypt.hash(contrasena, salt);

        // guardar en la DB
        await pool.query('INSERT INTO usuarios (correo, contrasena) VALUES (?, ?)', [correo, hashContrasena]);

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor al registrar' });
    }
};

exports.login = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        if (!correo || !contrasena) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // busca usuario
        const [usuarios] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        if (usuarios.length === 0) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        const usuario = usuarios[0];

        // compara contraseñas
        const coincide = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!coincide) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        // generar JWT (guardando el ID del usuario en el payload)
        const token = jwt.sign(
            { id: usuario.id, correo: usuario.correo },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.json({ message: 'Login exitoso', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor al iniciar sesión' });
    }
};