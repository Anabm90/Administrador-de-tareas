const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy


//Referencia al modelo donde vamos a autenticar
const Usuarios = require('../models/Usuarios')

//Local strategy
passport.use(
    new LocalStrategy(
        //por default espera un user y passw
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: { email, activo: 1}
                })
                //El usuario existe pero el password no es correcto
                if (!usuario.verificarPassword(password)) {
                    return done(null, false, {
                        message: 'Password incorrecto'
                    })
                }
                return done(null, usuario)
            } catch (error) {
                //Ese usuario no existe
                return done(null, false, {
                    message: 'Esa cuenta no existe'
                })
            }
        }
    )
)

//serializar el usuario
passport.serializeUser((usuario, callback) => {
    callback(null, usuario)
})

//deserializar el usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario)
})

module.exports = passport