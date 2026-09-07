const express = require("express");

const {
  createEmployee,
  getEmployees,
  getEmployeeById,
} = require("../controllers/employeeController");

const router = express.Router();

router.post("/", createEmployee);

router.get("/", getEmployees);

router.get("/:id", getEmployeeById);

module.exports = router;