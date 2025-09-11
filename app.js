const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./models"); // auto loads models/index.js

const departmentRoutes = require("./routes/departments");
const routes = require("./routes/index");
const app = express();
const cors = require("cors");
app.use(cors());

app.use(bodyParser.json());

// Routes
app.use("/api", routes);

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);

  try {
    await sequelize.authenticate();
    console.log("✅ Database connected!");
  } catch (error) {
    console.error("❌ Database connection error:", error);
  }
});
