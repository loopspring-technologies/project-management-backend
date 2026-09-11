const express = require("express");

const { createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");
const { getMyProjects,} = require("../controllers/projectAssignmentController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// router.post("/", createEmployee);
router.post( "/", protect, authorizeRoles("ADMIN"), createEmployee);
router.get("/", getEmployees);
router.get("/my-projects", protect, getMyProjects);
router.get("/:id", getEmployeeById);
// router.put("/:id", updateEmployee);
router.put( "/:id", protect, authorizeRoles("ADMIN"), updateEmployee);
// router.delete("/:id", deleteEmployee);
router.delete( "/:id", protect, authorizeRoles("ADMIN"), deleteEmployee);

module.exports = router;