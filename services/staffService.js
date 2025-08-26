const { Op } = require("sequelize");
const { Department, Faculty, Publication, Staff, School } = require("../models");

async function getAllStaff(q, page = 1, limit = 10) {
  try {
    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Build search condition if query exists
    const whereCondition = q
      ? {
          [Op.or]: [
            { name: { [Op.iLike]: `%${q}%` } },
            { email: { [Op.iLike]: `%${q}%` } },
            { designation: { [Op.iLike]: `%${q}%` } },
          ],
        }
      : {};

    // Get paginated results with total count
    const { count, rows: allStaff } = await Staff.findAndCountAll({
      where: whereCondition,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        // {
        //   model: Department,
        //   as: "department",
        //   attributes: ["name"],
        // },
        {
          model: School,
          as: "school",
          attributes: ["name"],
        },
      ],
      order: [["name", "ASC"]],
    });

    // Calculate total pages
    const totalPages = Math.ceil(count / limit);

    return {
      status: 200,
      data: {
        allStaff,
        metadata: {
          total: count,
          page: parseInt(page),
          totalPages,
          limit: parseInt(limit),
        },
      },
    };
  } catch (error) {
    return {
      status: 500,
      message: "Error fetching staff",
      details: error.message,
    };
  }
}
module.exports = {
  getAllStaff,
};
