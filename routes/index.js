const express = require("express");
const router = express.Router();

// Import modules
const departmentRoutes = require("./departments");
const dashboardRoutes = require("./dashboard");

// Mount them
router.use("/departments", departmentRoutes);
router.use("/dashboard", dashboardRoutes);

module.exports = router;
