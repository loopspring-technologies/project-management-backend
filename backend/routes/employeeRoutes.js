const express = require("express");

const {
  createEmployee,
  getEmployees,
  getEmployeeById, updateEmployeeStatus, updateEmployee
} = require("../controllers/employeeController");

const router = express.Router();

router.post("/", createEmployee);

router.get("/", getEmployees);

router.get("/:id", getEmployeeById);
router.patch("/:id/status", updateEmployeeStatus);
router.put("/:id", updateEmployees);

module.exports = router;