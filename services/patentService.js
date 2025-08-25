const { Department, Faculty, Publication, Patent } = require("../models");

async function getAllPatents() {
  // return await Department.findAll({
  //   include: [
  //     {
  //       model: Faculty,
  //       as: "faculty",
  //       attributes: ["id", "name"], // optional
  //     },
  //     {
  //       model: Publication,
  //       as: "publications",
  //       attributes: ["id", "name", "date"],
  //     },
  //   ],
  // });
  try {
    const allPatents = await Patent.findAll({});
    return {
      status: 200,
      allPatents,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Error fetching department statistics",
      details: error.message,
    };
  }
}
module.exports = {
  getAllPatents,
};
