MIGRATION GUIDE

> > > > > > > > > > > > > > > > > > > Create Models & Migrations <<<<<<<<<<<<<<<<<
> > > > > > > > > > > > > > > > > > > Faculty Table
> > > > > > > > > > > > > > > > > > > npx sequelize-cli model:generate --name Faculty --attributes name:string

This generates:
migrations/xxxx-create-faculty.js
models/faculty.js

Run Migrations
npx sequelize-cli db:migrate

Faculty ↔ Department Relationship

We’ll assume:

One Faculty has many Departments.

Each Department belongs to one Faculty.

That means we need a facultyId foreign key in the Departments table.

a) Create a Migration to Add facultyId

Since the table already exists, we generate a new migration:

npx sequelize-cli migration:generate --name add-facultyId-to-departments

This creates a file under migrations/.

Edit it like this:

"use strict";

module.exports = {
async up(queryInterface, Sequelize) {
await queryInterface.addColumn("Departments", "facultyId", {
type: Sequelize.INTEGER,
references: {
model: "Faculties", // table name (check your actual table name, usually pluralized)
key: "id",
},
onUpdate: "CASCADE",
onDelete: "SET NULL",
});
},

async down(queryInterface, Sequelize) {
await queryInterface.removeColumn("Departments", "facultyId");
},
};

Run migration:

npx sequelize-cli db:migrate

b) Update Models

models/department.js:

Department.associate = (models) => {
Department.hasMany(models.Publication, {
foreignKey: "departmentId",
as: "publications",
});

Department.belongsTo(models.Faculty, {
foreignKey: "facultyId",
as: "faculty",
});
};

models/faculty.js:

Faculty.associate = (models) => {
Faculty.hasMany(models.Department, {
foreignKey: "facultyId",
as: "departments",
});
};

Adding a New Column Later
Step 1: Generate a Migration
npx sequelize-cli migration:generate --name add-email-to-faculty

Step 2: Edit the Migration
"use strict";

module.exports = {
async up(queryInterface, Sequelize) {
await queryInterface.addColumn("Faculties", "email", {
type: Sequelize.STRING,
allowNull: true,
});
},

async down(queryInterface, Sequelize) {
await queryInterface.removeColumn("Faculties", "email");
},
};

Step 3: Run Migration
npx sequelize-cli db:migrate

Step 4: Update the Model

In models/faculty.js, add the field:

email: DataTypes.STRING
