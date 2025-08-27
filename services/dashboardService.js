// const Faculty = require("../models/faculty");
// const Department = require("../models/department");
// const Publication = require("../models/publication");
const {
  Faculty,
  Department,
  Publication,
  School,
  sequelize,
} = require("../models");
const Sequelize = require("sequelize");
// Get faculty, department, and publication counts
const getBasicCounts = async () => {
  const facultyCount = await Faculty.count();
  const schoolCount = await School.count();
  const publicationCount = await Publication.count();
  return { facultyCount, schoolCount, publicationCount };
};

// Get publication count per month (using 'date' column)
const getPublicationCountPerMonth = async () => {
  const result = await Publication.aggregate([
    { $group: { _id: { $month: "$date" }, count: { $sum: 1 } } },
    { $project: { month: "$_id", count: 1, _id: 0 } },
    { $sort: { month: 1 } },
  ]);
  return result;
};

// const getDepartmentPublicationCountsMonthly = async () => {
//   const results = await Department.findAll({
//     attributes: [
//       "id",
//       "name",
//       // extract year and month from publication date
//       [
//         Sequelize.fn(
//           "TO_CHAR",
//           Sequelize.col("publications.date"),
//           "YYYY-MM"
//         ),
//         "month",
//       ],
//       [
//         Sequelize.fn("COUNT", Sequelize.col("publications.id")),
//         "publicationCount",
//       ],
//     ],
//     include: [
//       {
//         model: Publication,
//         as: "publications",
//         attributes: [], // don’t fetch details
//       },
//     ],
//     group: ["Department.id", "month"],
//     order: [
//       ["id", "ASC"],
//       ["month", "ASC"],
//     ],
//     raw: true, // return plain objects
//   });

//   return results;
// };

// Main function using Promise.all
const getDepartmentPublicationCountsMonthly = async () => {
  const results = await sequelize.query(
    `
    WITH months AS (
      SELECT to_char(d, 'YYYY-MM') AS month
      FROM generate_series(
        (SELECT MIN(date) FROM "Publications"),
        (SELECT MAX(date) FROM "Publications"),
        interval '1 month'
      ) d
    )
    SELECT d.id AS "schoolId",
           d.name,
           m.month,
           COALESCE(COUNT(p.id), 0) AS "publicationCount"
    FROM "Schools" d
    CROSS JOIN months m
    LEFT JOIN "Publications" p
      ON p."schoolId" = d.id
     AND to_char(p.date, 'YYYY-MM') = m.month
    GROUP BY d.id, d.name, m.month
    ORDER BY d.id, m.month;
    `,
    { type: Sequelize.QueryTypes.SELECT }
  );

  return results;
};
async function getTopWords(limit = 20) {
  const STOPWORDS = new Set([
    "the",
    "and",
    "for",
    "with",
    "from",
    "that",
    "this",
    "are",
    "was",
    "were",
    "a",
    "an",
    "in",
    "on",
    "of",
    "to",
    "by",
    "as",
    "at",
    "it",
  ]);

  // Normalize a word: remove accents, lowercase, trim
  function normalizeWord(word) {
    return word
      .normalize("NFD") // decompose accented chars
      .replace(/[\u0300-\u036f]/g, "") // remove accents
      .toLowerCase()
      .trim();
  }

  // Fetch all titles from DB
  const publications = await Publication.findAll({
    attributes: ["name"],
    raw: true,
  });

  // Count words
  const counts = {};
  publications.forEach((pub) => {
    if (!pub.name) return;
    const words = pub.name.match(/\b\w+\b/g); // split words by word boundaries
    if (words) {
      words.forEach((w) => {
        const word = normalizeWord(w);
        if (word.length >= 3 && !STOPWORDS.has(word)) {
          counts[word] = (counts[word] || 0) + 1;
        }
      });
    }
  });

  // Sort and take top N
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word, count]) => ({ word, count }));
}

const getCounts = async (year) => {
  try {
    console.log("YEAR", year);
    const [
      basicCounts,
      publicationCountPerMonth,
      // departmentPublicationCounts,
      publicationWordCounts,
    ] = await Promise.all([
      getBasicCounts(),
      // getPublicationCountPerMonth(),
      getDepartmentPublicationCountsMonthly(),
      getTopWords(),
    ]);
    return {
      status: 200,
      data: {
        ...basicCounts,
        publicationCountPerMonth,
        publicationWordCounts,
      },
    };
  } catch (error) {
    return {
      status: 500,
      message: "Error fetching counts",
      details: error.message,
    };
  }
};

module.exports = {
  getCounts,
};
