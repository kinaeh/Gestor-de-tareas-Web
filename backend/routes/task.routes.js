/*
  define los endpoints para las tareas. 
  A diferencia de auth.routes, aquí inyectamos el middleware 'verifyToken'. 
  Si el cliente no envía un JWT válido en las cabeceras, la petición muere aquí y no llega al controlador.
*/

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const verifyToken = require('../middleware/auth.middleware');

// protege todas las rutas de este archivo con el middleware
router.get('/', verifyToken, taskController.getTasks);
router.post('/', verifyToken, taskController.createTask);

module.exports = router;