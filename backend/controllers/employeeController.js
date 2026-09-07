const Employee = require("../models/Employee");
const bcrypt = require("bcryptjs");

// Create Employee
exports.createEmployee = async (req, res) => {
  try {
    const { name, designation, username, password } = req.body;

    // Check required fields
    if (!name || !designation || !username || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, designation, username and password are required",
      });
    }

    // Validate 6-digit password
    if (!/^\d{6}$/.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be exactly 6 digits",
      });
    }

    // Check if username already exists
    const existingEmployee = await Employee.findOne({
      username: username.toLowerCase(),
    });

    if (existingEmployee) {
      return res.status(409).json({
        success: false,
        message: "Username already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create employee
    const employee = await Employee.create({
      name,
      designation,
      username: username.toLowerCase(),
      password: hashedPassword,
      role: "EMPLOYEE",
    });

    // Never send password back
    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      employee: {
        id: employee._id,
        name: employee.name,
        designation: employee.designation,
        username: employee.username,
        role: employee.role,
        isActive: employee.isActive,
      },
    });
  } catch (error) {
    console.error("Create employee error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create employee",
    });
  }
};


// Get All Employees
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: employees.length,
      employees,
    });
  } catch (error) {
    console.error("Get employees error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get employees",
    });
  }
};


// Get Single Employee
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).select(
      "-password"
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      employee,
    });
  } catch (error) {
    console.error("Get employee error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get employee",
    });
  }
};

// Update Employee
exports.updateEmployee = async (req, res) => {
  try {
    const { name, designation, username } = req.body;

    if (!name || !designation || !username) {
      return res.status(400).json({
        success: false,
        message: "Name, designation and username are required",
      });
    }

    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const existingEmployee = await Employee.findOne({
      username: username.toLowerCase(),
      _id: { $ne: req.params.id },
    });

    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    employee.name = name;
    employee.designation = designation;
    employee.username = username.toLowerCase();

    await employee.save();

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      employee: {
        id: employee._id,
        name: employee.name,
        designation: employee.designation,
        username: employee.username,
        role: employee.role,
        isActive: employee.isActive,
      },
    });
  } catch (error) {
    console.error("Update employee error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update employee",
    });
  }
};

// Activate / Deactivate Employee
exports.updateEmployeeStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be true or false",
      });
    }

    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    employee.isActive = isActive;

    await employee.save();

    res.status(200).json({
      success: true,
      message: `Employee ${
        isActive ? "activated" : "deactivated"
      } successfully`,
      employee: {
        id: employee._id,
        name: employee.name,
        designation: employee.designation,
        username: employee.username,
        role: employee.role,
        isActive: employee.isActive,
      },
    });
  } catch (error) {
    console.error("Update employee status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update employee status",
    });
  }
};