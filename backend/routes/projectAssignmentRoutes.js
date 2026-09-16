const express = require("express");

const {
  assignEmployeeToProject, getProjectEmployees, removeEmployeeFromProject, getProjectAllEmployees
} = require("../controllers/projectAssignmentController");

const router = express.Router({ mergeParams: true });

router.post("/", assignEmployeeToProject);
router.get("/", getProjectEmployees);
router.get("/", getProjectAllEmployees);
router.delete("/:employeeId", removeEmployeeFromProject);

module.exports = router;