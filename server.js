const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const Connect = require("./config/ConnectionDB");
const colors = require("colors");
const employeeRoutes=require("./routes/EmployeeRoutes")
const app = express();
app.use("/api/v1/employee",employeeRoutes)

Connect().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
    console.log(`Server running on port ${PORT}`);
  });
});
