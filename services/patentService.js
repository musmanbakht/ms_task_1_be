const { Op } = require("sequelize");
const {
  Department,
  Faculty,
  Publication,
  Patent,
  Sequelize,
  School,
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
    const patentsBySchool = await getPatentCountBySchool();
    const patentsByCountry = await getPatentCountByCountry();
    const topWords = await getTopWords(20);
    return {
      status: 200,
      data: {
        patentsBySchool,
        patentsByCountry,
        topWords,
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

const getPatentCountBySchool = async () => {
  const results = await Patent.findAll({
    attributes: [
      "schoolId",
      [
        // Cast count as integer (PostgreSQL syntax)
        Sequelize.literal('CAST(COUNT("Patent"."id") AS INTEGER)'),
        "patentCount",
      ],
    ],
    include: [
      {
        model: School,
        as: "school",
        attributes: ["id", "name"],
      },
    ],
    group: ["school.id", "Patent.schoolId"],
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
      [
        // Cast count as integer (PostgreSQL syntax)
        Sequelize.literal('CAST(COUNT("Patent"."id") AS INTEGER)'),
        "patentCount",
      ],
    ],
    group: ["country"],
    order: [[Sequelize.fn("COUNT", Sequelize.col("id")), "DESC"]], // order by function
    raw: true,
  });

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
  const patents = await Patent.findAll({
    attributes: ["title"],
    raw: true,
  });

  // Count words
  const counts = {};
  if (!patents || patents.length === 0) {
    return [];
  }
  patents.forEach((pub) => {
    if (!pub.title) return;
    const words = pub.title.match(/\b\w+\b/g); // split words by word boundaries
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

const deletePatentById = async (id) => {
  try {
    const deleted = await Patent.destroy({ where: { id } });
    if (deleted) {
      return { status: 200, message: "Patent deleted successfully" };
    } else {
      return { status: 404, message: "Patent not found" };
    }
  } catch (error) {
    return {
      status: 500,
      message: "Error fetching patent statistics",
      details: error.message,
    };
  }
};

module.exports = {
  getAllPatents,
  getPatentsStats,
  deletePatentById,
};
