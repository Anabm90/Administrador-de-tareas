const Usuarios = require('../models/Usuarios')
const enviarEmail = require('../handlers/email')

exports.formCrearCuenta = (req, res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear cuenta'
    })
}

exports.formIniciarSesion = (req, res) => {
    const error = res.locals.mensajes
    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar sesión',
        error: error
    })
}
exports.crearCuenta = async (req, res) => {

    const { email, password } = req.body
    //const error = res.locals.mensajes

    try {
        await Usuarios
            .create({
                email, password
            })
        
        
        //Crear URL de confirmación
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`

        //Crear objeto de usuario
        const usuario = {
                email
        }
        
        //Enviar email
        await enviarEmail.enviar({
        usuario,
        subject: 'Confirma tu cuenta',
        confirmarUrl,
        archivo: 'confirmar-cuenta'
        })

        //Reditigir al usuario
        req.flash('correcto','se ha enviado un correo a tu dirección de email')
        res.redirect('/iniciar-sesion')

    } catch (error) {
        req.flash('error', error.errors.map(error => error.message))
        res.render('crearCuenta', {
            nombrePagina: 'crear cuenta',
            mensajes: req.flash(),
            email,
            password
            
        })
    }

}

exports.formRestablecerPassword = (req, res) => {
    res.render('restablecer', {
        nombrePagina: 'Restablece tu contraseña'
    })
}

//Cambia el estado de una cuenta
exports.confirmarCuenta = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
            
        }
    })

    if (!usuario) {
        req.flash('error', 'no válido')
        res.redirect('/crear-cuenta')
    }

    usuario.activo = 1
    await usuario.save()

    req.flash('correcto', 'cuenta activada correctamente')
    res.redirect('/iniciar-sesion')
}
