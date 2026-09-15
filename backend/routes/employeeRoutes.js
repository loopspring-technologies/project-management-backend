const express = require("express");

const { createEmployee, getEmployees,
  getEmployeeById, updateEmployee, deleteEmployee,
} = require("../controllers/employeeController");
const { getMyProjects,} = require("../controllers/projectAssignmentController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", createEmployee);
router.get("/", getEmployees);
router.get("/my-projects", protect, getMyProjects);
router.get("/:id", getEmployeeById);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);


module.exports = router;