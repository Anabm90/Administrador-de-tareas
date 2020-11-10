const db = require("../config/db");
const Sequelize = require('sequelize');
const Proyectos = require("../models/Proyectos");
const bcrypt = require("bcrypt-nodejs");

const Usuarios = db.define('usuarios',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: Sequelize.STRING(60),
            allowNull: false,
            validate: {
                isEmail: {
                    msg: 'agrega un correo valido'
                }
            },
            unique: {
                args: true,
                msg: 'Usuario ya registrado'
            }
        },
        password: {
            type: Sequelize.STRING(60),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'el password no puede estar vacio'
                }
            }
        },
        activo: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        token: Sequelize.STRING,
        expiracion: Sequelize.DATE
    },
    {

        hooks: {
            beforeCreate(usuario) {
                usuario.password = bcrypt.hashSync(
                    usuario.password,
                    bcrypt.genSaltSync(10)
                );
            },
        },
    }
);
//Metodos personalizados
Usuarios.prototype.verificarPassword = function (password) {
    return bcrypt.compareSync(password, this.password)
}

Usuarios.hasMany(Proyectos);
module.exports = Usuarios;