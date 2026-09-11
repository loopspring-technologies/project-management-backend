const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const employeeRoutes = require("./routes/employeeRoutes");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const projectAssignmentRoutes = require("./routes/projectAssignmentRoutes");
const moduleRoutes = require("./routes/moduleRoutes");
const taskRoutes = require("./routes/taskRoutes");
const viewerRoutes = require("./routes/viewerRoutes");

const app = express();
// hello

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/employees", employeeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use( "/api/projects/:projectId/employees", projectAssignmentRoutes);
app.use( "/api/projects/:projectId/modules", moduleRoutes);
app.use( "/api/modules/:moduleId/tasks", taskRoutes);
app.use("/api/viewer", viewerRoutes);


connectDB();

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