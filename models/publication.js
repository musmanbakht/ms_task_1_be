"use strict";
const { Model } = require("sequelize");
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
  }
  Publication.init(
    {
      name: DataTypes.STRING,
      date: DataTypes.DATE,
      departmentId: DataTypes.INTEGER,
      published: DataTypes.DATE, // <-- new column
    },
    {
      sequelize,
      modelName: "Publication",
    }
  );
  Publication.associate = (models) => {
    Publication.belongsTo(models.Department, {
      foreignKey: "departmentId",
      as: "department",
    });
    Publication.belongsTo(models.School, {
      foreignKey: "schoolId",
      as: "school",
    });
  };
  return Publication;
};
