"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Staff extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Staff.belongsTo(models.Department, {
        foreignKey: "departmentId",
        as: "department",
      });
            Staff.belongsTo(models.School, {
        foreignKey: "schoolId",
        as: "school",
      });
    
    }
  }
  Staff.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      designation: DataTypes.STRING,
      departmentId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Staff",
    }
  );
  return Staff;
};
