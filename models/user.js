//#userModel
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasOne(models, {foreignKey: 'userId'});
    }
  };
  User.init({
    name: DataTypes.STRING,
    surname: DataTypes.STRING,
    nick: DataTypes.STRING,
    email: DataTypes.STRING,    
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  }); 

  return User;
};