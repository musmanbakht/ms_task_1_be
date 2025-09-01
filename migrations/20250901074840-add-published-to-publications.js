"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Publications", "published", {
      type: Sequelize.DATE,
      allowNull: true, // set false if you want it required
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Publications", "published");
  },
};
