'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class clave extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  clave.init({
    userID: DataTypes.INTEGER,
    key: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'clave',
  });
  return clave;
};