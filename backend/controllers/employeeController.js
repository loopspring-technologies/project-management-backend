const Employee = require("../models/Employee");
const ProjectAssignment = require("../models/ProjectAssignment");

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

    if (password.length < 6) {
  return res.status(400).json({
    success: false,
    message: "Password must be at least 6 characters",
  });
}

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
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create employee
    const employee = await Employee.create({
      name,
      designation,
      username: username.toLowerCase(),
      // password: hashedPassword,
      password,
      role: "EMPLOYEE",
    });

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      employee: {
        id: employee._id,
        name: employee.name,
        designation: employee.designation,
        username: employee.username,
        password:employee.password,
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


// Get Employees with Pagination
exports.getEmployees = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    if (isNaN(page) || page < 1) {
      page = 1;
    }
    if (isNaN(limit) || limit < 1 || limit > 100) {
      limit = 10;
    }

    const skip = (page - 1) * limit;

    const employees = await Employee.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalEmployees = await Employee.countDocuments();

    const totalPages = Math.ceil(totalEmployees / limit);

    res.status(200).json({
      success: true,
      count: employees.length,

      pagination: {
        currentPage: page,
        limit,
        totalEmployees,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },

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


exports.updateEmployee = async (req, res) => {
  try {
    const { name, designation, username, password, isActive, } = req.body;

    if (!name || !designation || !username || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Name, designation, username and password are required",
      });
    }
     if (password.length < 6) {
  return res.status(400).json({
    success: false,
    message: "Password must be at least 6 characters",
  });
}

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

    const existingEmployee = await Employee.findOne({
      username: username.toLowerCase(),
      _id: { $ne: req.params.id },
    });

    if (existingEmployee) {
      return res.status(409).json({
        success: false,
        message: "Username already exists",
      });
    }

    employee.name = name;
    employee.designation = designation;
    employee.username = username.toLowerCase();
    employee.password = password;
    employee.isActive = isActive;

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

// Delete Employee
exports.deleteEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const assignedProjects = await ProjectAssignment.countDocuments({
      employeeId: employeeId,
      status: "ACTIVE",
    });

    if (assignedProjects > 0) {
      return res.status(400).json({
        success: false,
        canDelete: false,
        message:
          "This employee is assigned projects.",
      });
    }
    await Employee.findByIdAndDelete(employeeId);

    res.status(200).json({
      success: true,
      canDelete: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    console.error("Delete employee error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete employee",
    });
  }
};