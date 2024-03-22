'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class webtoon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  webtoon.init({
    user_id: DataTypes.INTEGER,
    webtoon_title: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'webtoon',
    tableName: 'webtoons',
    timestamps: false
  });
  return webtoon;
};