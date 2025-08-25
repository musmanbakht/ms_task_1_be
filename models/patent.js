"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Patent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // A patent belongs to a department
      Patent.belongsTo(models.Department, {
        foreignKey: "departmentId",
        as: "department",
      });
    }
  }

  Patent.init(
    {
      patent_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      abstract: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      filing_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      grant_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      assignee: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING(2),
        allowNull: false,
      },
      departmentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Patent",
    }
  );

  return Patent;
};
