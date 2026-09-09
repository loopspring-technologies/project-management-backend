const Employee = require("../models/Employee");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const employee = await Employee.findOne({
      username: username.toLowerCase(),
    });

    if (!employee) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    if (employee.role !== "EMPLOYEE") {
      return res.status(403).json({
        success: false,
        message: "Only employees can login",
      });
    }

    if (!employee.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is inactive",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      employee.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const token = generateToken(employee);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      employee: {
        id: employee._id,
        name: employee.name,
        designation: employee.designation,
        username: employee.username,
        role: employee.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      employee: req.employee,
    });
  } catch (error) {
    console.error("Get me error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get employee details",
    });
  }
};