const {Sequelize, DataTypes, Model} = require('sequelize')

module.exports = new Sequelize(
    'postgres://yourUserName:yourPass@localhost:yourPort/yourDBName'
)


