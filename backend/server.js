const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const employeeRoutes = require("./routes/employeeRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();


// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/employees", employeeRoutes);
app.use("/api/auth", authRoutes);


connectDB();
// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Project Management Backend is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});