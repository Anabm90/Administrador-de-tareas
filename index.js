const express = require('express')
const routes = require('./routes')
const path = require('path')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const flash = require('connect-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('./config/passport')
require('dotenv').config({path: '.env'})

//helpers con algunas fx
const helpers = require('./helpers')

//crear la conxecion a la DDBB
const db = require('./config/db')

//importar el modelo
require('./models/Proyectos')
require('./models/Tareas')
require('./models/Usuarios')

db.sync()
    .then(() => console.log('conectado al servidor'))
    .catch(error => console.log(error, 'error'))

//crear una app de express
const app = express();

//habilitar bodyParser
app.use(bodyParser.urlencoded({ extended: true }))
//Agregamos express validator
// app.use(expressValidator())

//cargar archivos estáticos
app.use(express.static('public'))

//Habilitar pug
app.set('view engine', 'pug')

//Añadir carpeta vistas
app.set('views', path.join(__dirname, './views'))

//Agregar flash messades
app.use(flash())

app.use(cookieParser())

//sesiones
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

//Pasar vardump a la app
app.use((req, res, next) => {
   
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash()
    res.locals.usuario = { ...req.user } || null;
    //console.log(res.locals.usuario)
    next();
})

//aprendiendo Middleware
// app.use((req, res, next) => {
//     const fecha = new Date()
//     res.locals.year = fecha.getFullYear()
//     next()
// })


app.use('/', routes())




//Servidor y puerto
const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3000

app.listen(port, host, () => {
    console.log('el servidor está funcionando')
})

