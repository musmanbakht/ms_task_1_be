const express = require("express");
const router = express.Router();
const staffService = require("../services/staffService");

// GET /api/departments/all
router.get("/", async (req, res) => {
  try {
    const { q, page, limit } = req.query;
    const patents = await staffService.getAllStaff(q, page, limit);
    res.json(patents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const patents = await staffService.deleteStaffById(id);
    res.json(patents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});
module.exports = router;
