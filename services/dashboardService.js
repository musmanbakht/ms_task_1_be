// const Faculty = require("../models/faculty");
// const Department = require("../models/department");
// const Publication = require("../models/publication");
const { Faculty, Department, Publication } = require("../models");
const Sequelize = require("sequelize");
// Get faculty, department, and publication counts
const getBasicCounts = async () => {
  const facultyCount = await Faculty.count();
  const departmentCount = await Department.count();
  const publicationCount = await Publication.count();
  return { facultyCount, departmentCount, publicationCount };
};

// Get publication count per month (using 'date' column)
const getPublicationCountPerMonth = async () => {
  const result = await Publication.aggregate([
    { $group: { _id: { $month: "$date" }, count: { $sum: 1 } } },
    { $project: { month: "$_id", count: 1, _id: 0 } },
    { $sort: { month: 1 } }
  ]);
  return result;
};


const getDepartmentPublicationCountsMonthly = async () => {
  const results = await Department.findAll({
    attributes: [
      "id",
      "name",
      // extract year and month from publication date
      [
        Sequelize.fn(
          "TO_CHAR",
          Sequelize.col("publications.date"),
          "YYYY-MM"
        ),
        "month",
      ],
      [
        Sequelize.fn("COUNT", Sequelize.col("publications.id")),
        "publicationCount",
      ],
    ],
    include: [
      {
        model: Publication,
        as: "publications",
        attributes: [], // don’t fetch details
      },
    ],
    group: ["Department.id", "month"],
    order: [
      ["id", "ASC"],
      ["month", "ASC"],
    ],
    raw: true, // return plain objects
  });

  return results;
};


// Main function using Promise.all
const getCounts = async () => {
  try {
    const [basicCounts, publicationCountPerMonth, departmentPublicationCounts] = await Promise.all([
      getBasicCounts(),
      // getPublicationCountPerMonth(),
      getDepartmentPublicationCountsMonthly()
    ]);
    return {
      status: 200,
      data: {
        ...basicCounts,
        publicationCountPerMonth,
        departmentPublicationCounts
      }
    };
  } catch (error) {
    return {
      status: 500,
      message: "Error fetching counts",
      details: error.message
    };
  }
};

module.exports = {
  getCounts,
};