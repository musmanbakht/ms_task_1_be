"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Patents", "country", {
      type: Sequelize.STRING(50), // change length to 50
      allowNull: false,
    });
  },
  async down(queryInterface, Sequelize) {
    // rollback to STRING(2)
    await queryInterface.changeColumn("Patents", "country", {
      type: Sequelize.STRING(2),
      allowNull: false,
    });
  },
};
