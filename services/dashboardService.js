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
const getCounts = async (year) => {
  try {
    console.log("YEAR", year);
    let yearToUse = null;
    if (
      year !== undefined &&
      year !== null &&
      year !== "" &&
      year !== "null" &&
      year !== "undefined"
    ) {
      const parsedYear = Number(year);
      if (!isNaN(parsedYear)) {
        yearToUse = parsedYear;
      }
    }
    const [
      basicCounts,
      publicationCountPerMonth,
      // departmentPublicationCounts,
      publicationWordCounts,
    ] = await Promise.all([
      getBasicCounts(yearToUse),
      // getPublicationCountPerMonth(),
      getDepartmentPublicationCountsMonthly(yearToUse),
      getTopWords(yearToUse),
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
const getBasicCounts = async (year) => {
  const facultyCount = await Faculty.count();
  const schoolCount = await School.count();
  const whereClause = year
    ? sequelize.where(
        sequelize.fn("EXTRACT", sequelize.literal('YEAR FROM "published"')),
        year
      )
    : {};
  const publicationCount = await Publication.count({
    where: whereClause,
  });

  return { facultyCount, schoolCount, publicationCount };
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

const getDepartmentPublicationCountsMonthly = async (year) => {
  const replacements = { year };

  const results = await sequelize.query(
    `
    WITH months AS (
      SELECT to_char(d, 'YYYY-MM') AS month
      FROM generate_series(
        ${
          year
            ? `date '${year}-01-01'`
            : `(SELECT MIN("date") FROM "Publications")`
        },
        ${
          year
            ? `date '${year}-12-31'`
            : `(SELECT MAX("date") FROM "Publications")`
        },
        interval '1 month'
      ) d
    )
    SELECT s.id AS "schoolId",
           s.abbreviation AS "schoolAbbreviation",
           m.month,
           COALESCE(COUNT(p.id), 0) AS "submissionCount",
           COALESCE(SUM(CASE WHEN p."published" IS NOT NULL THEN 1 ELSE 0 END), 0) AS "publishedCount"
    FROM "Schools" s
    CROSS JOIN months m
    LEFT JOIN "Publications" p
      ON p."schoolId" = s.id
     AND to_char(p."date", 'YYYY-MM') = m.month
     ${year ? `AND EXTRACT(YEAR FROM p."date") = :year` : ""}
    GROUP BY s.id, s.abbreviation, m.month
    ORDER BY s.id, m.month;
    `,
    {
      replacements,
      type: Sequelize.QueryTypes.SELECT,
    }
  );

  return results;
};

async function getTopWords(year, limit = 100) {
  const whereClause = year
    ? sequelize.where(
        sequelize.fn("EXTRACT", sequelize.literal('YEAR FROM "published"')),
        year
      )
    : {};
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
    "sample",
    "publication",
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
    where: whereClause,
    attributes: ["name"],
    raw: true,
  });

  // Count words
  const counts = {};
  if (!publications || publications.length === 0) {
    return [];
  }
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
    .map(([text, value]) => ({ text, value }));
}
async function getAllDepartments() {
  try {
    const allDepartments = await School.findAll({
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
        "abbreviation",
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
      group: ["School.id", "faculty.id"], // group by department
    });
    return {
      status: 200,
      allSchools: allDepartments,
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
  getCounts,
};
