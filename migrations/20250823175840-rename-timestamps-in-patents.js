"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn("Patents", "created_at", "createdAt");
    await queryInterface.renameColumn("Patents", "updated_at", "updatedAt");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn("Patents", "createdAt", "created_at");
    await queryInterface.renameColumn("Patents", "updatedAt", "updated_at");
  },
};
