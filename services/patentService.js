const { Op } = require("sequelize");
const {
  Department,
  Faculty,
  Publication,
  Patent,
  Sequelize,
  School
} = require("../models");

async function getAllPatents(q, page = 1, limit = 10) {
  try {
    const offset = (page - 1) * limit;
    const where = q
      ? {
          [Op.or]: [
            { title: { [Op.iLike]: `%${q}%` } },
            { patent_number: { [Op.iLike]: `%${q}%` } },
            { assignee: { [Op.iLike]: `%${q}%` } },
          ],
        }
      : {};
    const { rows: allPatents, count: total } = await Patent.findAndCountAll({
      where,
      include: [
        // {
        //   model: Department,
        //   as: "department",
        //   attributes: ["id", "name"],
        // },
        {
          model: School,
          as: "school",
          attributes: ["id", "name"],
        },
      ],
      offset,
      limit,
    });
    return {
      status: 200,
      data: {
        allPatents,
        metaData: {
          total,
          page: parseInt(page),
          totalPages: Math.ceil(total / limit),
          limit: parseInt(limit),
        },
      },
    };
  } catch (error) {
    return {
      status: 500,
      message: "Error fetching patent statistics",
      details: error.message,
    };
  }
}
async function getPatentsStats() {
  try {
    const patentsBySchool = await getPatentCountByDepartment();
    const patentsByCountry = await getPatentCountByCountry();
    return {
      status: 200,
      patentsBySchool,
      patentsByCountry,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Error fetching patent statistics",
      details: error.message,
    };
  }
}

const getPatentCountByDepartment = async () => {
  const results = await Patent.findAll({
    attributes: [
      "departmentId",
      [Sequelize.fn("COUNT", Sequelize.col("Patent.id")), "patentCount"],
    ],
    include: [
      {
        model: Department,
        as: "department",
        attributes: ["id", "name"],
      },
    ],
    group: ["department.id", "Patent.departmentId"],
    order: [[Sequelize.fn("COUNT", Sequelize.col("Patent.id")), "DESC"]],
    raw: true,
    nest: true,
  });

  return results;
};

const getPatentCountByCountry = async () => {
  const results = await Patent.findAll({
    attributes: [
      "country",
      [Sequelize.fn("COUNT", Sequelize.col("id")), "patentCount"],
    ],
    group: ["country"],
    order: [[Sequelize.fn("COUNT", Sequelize.col("id")), "DESC"]], // order by function
    raw: true,
  });

  return results;
};

module.exports = {
  getAllPatents,
  getPatentsStats,
};
