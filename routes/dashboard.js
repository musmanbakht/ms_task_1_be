const express = require("express");
const router = express.Router();
const departmentService = require("../services/departmentService");
const dashboardService = require("../services/dashboardService");
// GET /api/departments/all
router.get("/", async (req, res) => {
  try {
    const {year} = req.query
    const dashboardStats = await dashboardService.getCounts(year);
    res.json(dashboardStats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
