const { Department, Faculty, Publication } = require("../models");
const Sequelize = require("sequelize");

async function getAllDepartments() {
  try {
    const allDepartments = await Department.findAll({
      attributes: [
        "id",
        "name",
        [
          Sequelize.cast(
            Sequelize.fn("COUNT", Sequelize.col("publications.id")),
            "INTEGER"
          ),
          "publicationCount",
        ],
        "lat",
        "long",
        "facultyId",
        "createdAt",
      ],
      include: [
        {
          model: Publication,
          as: "publications",
          attributes: [], // we don’t need publication details, just count
        },
        {
          model: Faculty,
          as: "faculty",
          attributes: ["id", "name"], // optional
        },
      ],
      group: ["Department.id", "faculty.id"], // group by department
    });
    return {
      status: 200,
      allDepartments,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Error fetching department statistics",
      details: error.message,
    };
  }
}

const createDepartment = async (body) => {
  try {
    if (!body.name || !body.facultyId) {
      return {
        status: 400,
        message: "Name and Faculty ID are required",
      };
    }
    const createdDepartment = await Department.create(body);
    return {
      status: 201,
      message: "Department created successfully",
      data: createdDepartment,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Error fetching department statistics",
    };
  }
};
const deleteDepartment = async (id) => {
  try {
    const departmentToDelete = await Department.destroy({
      where: { id },
    });
    return {
      status: 200,
      message: "Department deleted successfully",
      departmentToDelete,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Error fetching department statistics",
    };
  }
};

module.exports = {
  getAllDepartments,
  createDepartment,
  deleteDepartment,
};
