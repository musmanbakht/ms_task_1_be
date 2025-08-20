const { Faculty, Department, Publication, sequelize } = require("./models");

async function run() {
  await sequelize.authenticate();

  const dept = await Department.create({
    name: "Computer Science",
    lat: -25.755,
    long: 28.233,
  });

  const pub = await Publication.create({
    name: "AI Research Paper",
    date: new Date(),
    departmentId: dept.id,
  });

  console.log("Created:", dept.toJSON(), pub.toJSON());
}

run();
