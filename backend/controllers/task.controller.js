/*
  maneja el CRUD de tareas. Usa el ID del usuario extraído del JWT (gracias al middleware)
  para asegurarse de que un usuario SOLO pueda ver y crear sus propias tareas.
*/

const pool = require('../config/db');

exports.getTasks = async (req, res) => {
    try {
        // req.user viene del middleware auth.middleware.js decodificado
        const userId = req.user.id;

        const [tareas] = await pool.query('SELECT * FROM tareas WHERE id_usuario = ? ORDER BY creado_en DESC', [userId]);
        res.json(tareas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las tareas' });
    }
};

exports.createTask = async (req, res) => {
    try {
        const { titulo } = req.body;
        const userId = req.user.id;

        if (!titulo) {
            return res.status(400).json({ message: 'El título de la tarea es requerido' });
        }

        await pool.query('INSERT INTO tareas (titulo, id_usuario) VALUES (?, ?)', [titulo, userId]);
        res.status(201).json({ message: 'Tarea creada exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la tarea' });
    }
};