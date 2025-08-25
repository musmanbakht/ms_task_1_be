"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Department extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Department.init(
    {
      name: DataTypes.STRING,
      lat: DataTypes.FLOAT,
      long: DataTypes.FLOAT,
      abbreviation: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Department",
    }
  );

  Department.associate = (models) => {
    Department.hasMany(models.Publication, {
      foreignKey: "departmentId",
      as: "publications",
    });
    Department.belongsTo(models.Faculty, {
      foreignKey: "facultyId",
      as: "faculty",
    });
    Department.associate = function (models) {
      Department.hasMany(models.Patent, {
        foreignKey: "departmentId",
        as: "patents",
      });
    };
    Department.hasMany(models.Staff, {
      foreignKey: "departmentId",
      as: "staff",
    });
  };
  return Department;
};
