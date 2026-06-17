/*
  define los endpoints públicos para la autenticación. 
  Conecta las URLs '/register' y '/login' con sus funciones correspondientes en el controlador.
*/

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;