const { Department, Faculty, Publication } = require("../models");

async function getAllDepartments() {
  return await Department.findAll({
    include: [
      {
        model: Faculty,
        as: "faculty",
        attributes: ["id", "name"], // optional
      },
      {
        model: Publication,
        as: "publications",
        attributes: ["id", "name", "date"],
      },
    ],
  });
}

module.exports = {
  getAllDepartments,
};
