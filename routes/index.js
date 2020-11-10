const express = require('express')
const router = express.Router()

//Importar express validator
const { body } = require('express-validator/check')

const proyectosController = require('../controllers/proyectosControler')
const tareasController = require('../controllers/tareasController')
const usuariosController = require('../controllers/usuariosController')
const authController = require('../controllers/authController')

module.exports = function () {

    // ruta para home
    router.get('/',
        authController.usuarioAutenticado,
        proyectosController.proyectosHome);
    router.get('/nuevo-proyecto',
        authController.usuarioAutenticado,
        proyectosController.formularioProyecto)
    router.post('/nuevo-proyecto',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevoProyecto)

    //Listar proyecto
    router.get('/proyectos/:url',
        authController.usuarioAutenticado,
        proyectosController.proyectoPorUrl)

    // Actualizar proyecto
    router.get('/proyecto/editar/:id',
        authController.usuarioAutenticado,
        proyectosController.formularioEditar)
    router.post('/nuevo-proyecto/:id',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.actualizarProyecto)

    // Eliminar proyecto
    router.delete('/proyectos/:url',
        authController.usuarioAutenticado,
        proyectosController.eliminarProyecto)

    //Tareas 
    router.post('/proyectos/:url',
        authController.usuarioAutenticado,
        tareasController.agregarTarea)

    //Actualizando tarea
    router.patch('/tareas/:id',
        authController.usuarioAutenticado,
        tareasController.cambiarEstadoTarea)

    //Eliminar tarea
    router.delete('/tareas/:id',
        authController.usuarioAutenticado,
        tareasController.eliminarTarea)

    //Crear cuenta
    router.get('/crear-cuenta', usuariosController.formCrearCuenta)
    router.post('/crear-cuenta', usuariosController.crearCuenta)
    router.get('/confirmar/:correo', usuariosController.confirmarCuenta)

    //Iniciar sesión
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion)
    router.post('/iniciar-sesion', authController.autenticarUsuario)

    //Cerrar sesion
    router.get('/cerrar-sesion', authController.cerrarSesion)

    //Reestablecer contraseña
    router.get('/restablecer', usuariosController.formRestablecerPassword)
    router.post('/restablecer', authController.enviarToken)
    router.get('/restablecer/:token', authController.validarToken)
    router.post('/restablecer/:token', authController.actualizarPassword)

    return router;
}
