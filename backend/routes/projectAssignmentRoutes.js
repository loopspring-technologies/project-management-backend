const express = require("express");

const {
  assignEmployeeToProject, getProjectEmployees, removeEmployeeFromProject
} = require("../controllers/projectAssignmentController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router({ mergeParams: true });

// router.post("/", assignEmployeeToProject);
router.post( "/", protect, authorizeRoles("ADMIN"), assignEmployeeToProject);
router.get("/", getProjectEmployees);
// router.delete("/:employeeId", removeEmployeeFromProject);
router.delete( "/:employeeId", protect, authorizeRoles("ADMIN"), removeEmployeeFromProject);


module.exports = router;