const express = require("express");
const router = express.Router();

// Import modules
const departmentRoutes = require("./departments");
const dashboardRoutes = require("./dashboard");
const staffRoutes = require("./staff");
const patentRoutes = require("./patent");

// Mount them
router.use("/departments", departmentRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/staff", staffRoutes);
router.use("/patent", patentRoutes);

module.exports = router;
