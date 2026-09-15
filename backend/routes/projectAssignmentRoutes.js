const express = require("express");

const {
  assignEmployeeToProject, getProjectEmployees, removeEmployeeFromProject
} = require("../controllers/projectAssignmentController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router({ mergeParams: true });

router.post("/", assignEmployeeToProject);
router.get("/", getProjectEmployees);
router.delete("/:employeeId", removeEmployeeFromProject);


module.exports = router;