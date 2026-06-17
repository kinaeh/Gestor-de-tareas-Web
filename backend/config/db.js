/*
  establece la conexión con la base de datos MySQL usando las variables del archivo `.env`.
  Utiliza 'mysql2/promise' para permitirnos usar async/await en los controladores, haciendo el código más limpio.
  Se exporta para que los controladores puedan hacer consultas (queries).
*/

const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.PORT_DB || 3306, // Por si acaso usas un puerto personalizado
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;