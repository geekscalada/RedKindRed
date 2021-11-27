//#cambiar para no tener surname en la tabla de publicaiones
const sequelizePaginate = require('sequelize-paginate')
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Publication extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Publication.init({
    text: DataTypes.STRING,
    surname: DataTypes.STRING,
    file: DataTypes.STRING,
    userID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Publication',
  });
  sequelizePaginate.paginate(Publication)
  return Publication;
};