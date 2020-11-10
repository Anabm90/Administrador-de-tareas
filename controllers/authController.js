const passport = require('passport')
const Usuarios = require('../models/Usuarios')
//Para generar el token
const crypto = require('crypto')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const bcrypt = require('bcrypt-nodejs')
const enviarEmail = require('../handlers/email')

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'ambos campos son obligatorios'
})

//Funcion para revisar si el usuario está logg o no
exports.usuarioAutenticado = (req, res, next) => {
    //Si el usuario está autentiacdo
    if (req.isAuthenticated()) {
        return next()
    }

    //si no está atutenticado
    return res.redirect('/iniciar-sesion')

}

//Cerrar sesión
exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion')
    })
}

exports.enviarToken = async (req, res) => {
    //Verificar que el usuario existe
    const usuario = await Usuarios.findOne({
        where: {
            email: req.body.email
        }
    })

    if (!usuario) {
        req.flash('error', 'No existe esa cuenta')
        res.redirect('/restablecer')
    }


    //Usuario existe
    usuario.token = crypto.randomBytes(20).toString('hex')
    usuario.expiracion = Date.now() + 3600000
    await usuario.save()
    
    //Url de reset
    const resetUrl = `http://${req.headers.host}/restablecer/${usuario.token}`
    await enviarEmail.enviar({
        usuario,
        subject: 'password reset',
        resetUrl,
        archivo: 'restablecer-password'
    })
    
    req.flash('correcto','se ha enviado un correo a tu dirección de email')
    res.redirect('/iniciar-sesion')
}

exports.validarToken = async (req, res) => {
    const usuario = Usuarios.findOne({
        where: {
            token: req.params.token
        }
    })
    if (!usuario) {
        req.flash('error', 'No válido')
        res.redirect('/restablecer')
    }
    
    //Formulario para genrear nuevo password
    res.render('resetPassword', {
        nombrePagina: 'Restablecer'
    })
}

//Cambia el password por uno nuevo
exports.actualizarPassword = async (req, res) => {
    console.log('hoooooooooooolaaaaaaaa')
     const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
             expiracion: {
                [Op.gte]: Date.now()
            }
        }
     })
    
    //Verificamos si el usuario existe
    
    if (!usuario) {
        req.flash('error', 'No válido')
        res.redirect('/restablecer')
    }

    //hashear el password

    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token = null
    usuario.expiracion = null

    //guardamos el  nuevo password
    await usuario.save()

    req.flash('correcto', 'tu password se ha modificado')
    res.redirect('/iniciar-sesion')

}