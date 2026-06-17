const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Corrección: en la foto dice 'require' con error de dedo 'require', aquí ya está corregido

const app = express();

app.use(express.json());
app.use(cors());

const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 3000; // Corrección: Se añade '|| 3000' como buena práctica por si el .env no carga.

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});