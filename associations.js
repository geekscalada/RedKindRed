const Sequelize = require('sequelize');
const {DataTypes} = require('sequelize')
const sequelize = require('./config/database.js')

let User = require('./models/user')(sequelize, Sequelize);
let Key = require('./models/key')(sequelize, Sequelize);
let Friend = require('./models/friend')(sequelize, Sequelize)



User.hasOne(Key, {foreignKey: 'userId'});
Key.belongsTo(User, {foreignKey: 'userId'});





