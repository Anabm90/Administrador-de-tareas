const { Sequelize } = require('sequelize');
require('dotenv').config({path: '.env'})
// Option 2: Passing parameters separately (other dialects)


// const db = new Sequelize('uptasknode', 'root', 'routeroute', {
//     host: 'localhost',
//     dialect: 'mysql',
//     define: {
//          timestamps: false
//      }
    
// })

const db = new Sequelize(process.env.BD_NOMBRE, process.env.BD_USER,process.env.BD_PASSWORD, {
    host: process.env.BD_HOST,
    dialect: 'mysql',
    port: process.env.BD_PORT,
    define: {
        timestamps: false
    },
}
)

module.exports = db