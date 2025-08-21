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
// GET /api/departments/all
router.post("/", async (req, res) => {
  try {
    const departments = await departmentService.createDepartment(req.body);
    res.json(departments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});
// GET /api/departments/all
router.delete("/:id", async (req, res) => {
  try {
    const departments = await departmentService.deleteDepartment(req.params.id);
    res.json(departments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
