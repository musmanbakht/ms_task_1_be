const express = require("express");
const router = express.Router();
const patentService = require("../services/patentService");

// GET /api/departments/all
router.get("/", async (req, res) => {
  try {
    const { q, page, limit } = req.query;
    const patents = await patentService.getAllPatents(q, page, limit);
    res.json(patents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});
router.get("/stats", async (req, res) => {
  try {
    const { schoolId } = req.query;
    console.log("first", schoolId);
    const patents = await patentService.getPatentsStats(schoolId);
    res.json(patents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const patents = await patentService.deletePatentById(id);
    res.json(patents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});
module.exports = router;
