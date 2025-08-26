'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class School extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
       static associate(models) {
      School.hasMany(models.Publication, {
        foreignKey: "schoolId",
        as: "publications",
      });
      School.hasMany(models.Patent, {
        foreignKey: "schoolId",
        as: "patents",
      });
      School.hasMany(models.Staff, {
        foreignKey: "schoolId",
        as: "staff",
      });
      School.belongsTo(models.Faculty, {
        foreignKey: "facultyId",
        as: "faculty",
      });
    }
  }
  School.init({
    name: DataTypes.STRING,
    lat: DataTypes.FLOAT,
    long: DataTypes.FLOAT,
    abbreviation: DataTypes.STRING,
    facultyId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'School',
  });
  return School;
};