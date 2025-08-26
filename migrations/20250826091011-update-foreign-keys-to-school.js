'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Publications table
    // await queryInterface.removeColumn('Publications', 'departmentId');
    await queryInterface.addColumn('Publications', 'schoolId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Schools',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    // Patents table
    // await queryInterface.removeColumn('Patents', 'departmentId');
    await queryInterface.addColumn('Patents', 'schoolId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Schools',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    // Staff table
    // await queryInterface.removeColumn('Staff', 'departmentId');
    await queryInterface.addColumn('Staffs', 'schoolId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Schools',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

down: async (queryInterface, Sequelize) => {
    // Publications table
    // await queryInterface.removeColumn('Publications', 'schoolId');
    // await queryInterface.addColumn('Publications', 'departmentId', {
    //   type: Sequelize.INTEGER,
    //   references: {
    //     model: 'Departments',
    //     key: 'id',
    //   },
    //   onUpdate: 'CASCADE',
    //   onDelete: 'SET NULL',
    // });

    // Patents table
    // await queryInterface.removeColumn('Patents', 'schoolId');
    // await queryInterface.addColumn('Patents', 'departmentId', {
    //   type: Sequelize.INTEGER,
    //   references: {
    //     model: 'Departments',
    //     key: 'id',
    //   },
    //   onUpdate: 'CASCADE',
    //   onDelete: 'SET NULL',
    // });

    // Staff table
    // await queryInterface.removeColumn('Staff', 'schoolId');
  //   await queryInterface.addColumn('Staff', 'departmentId', {
  //     type: Sequelize.INTEGER,
  //     references: {
  //       model: 'Departments',
  //       key: 'id',
  //     },
  //     onUpdate: 'CASCADE',
  //     onDelete: 'SET NULL',
  //   });
  },
};
