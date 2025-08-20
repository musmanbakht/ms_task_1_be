const express = require("express");
const router = express.Router();

// Import modules
const departmentRoutes = require("./departments");

// Mount them
router.use("/departments", departmentRoutes);

module.exports = router;
