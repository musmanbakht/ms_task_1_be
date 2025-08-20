const express = require("express");
const router = express.Router();
const departmentService = require("../services/departmentService");

// GET /api/departments/all
router.get("/all", async (req, res) => {
  try {
    const departments = await departmentService.getAllDepartments();
    res.json(departments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
