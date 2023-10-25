const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const Connect = require("./config/ConnectionDB");
const colors = require("colors");
const userRoutes=require("./routes/UserRoutes");
const { requstDetails } = require("./middleware/RequestDetails");

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(requstDetails)
app.use("/api/v1/user",userRoutes)
app.use("/uploads",express.static("uploads"));

Connect().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}/api/v1/user`);
    console.log(`Server running on port ${PORT}`);
  });
});

