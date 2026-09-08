const ProjectAssignment = require("../models/ProjectAssignment");
const Project = require("../models/Project");
const Employee = require("../models/Employee");

// Assign Employee to Project
exports.assignEmployeeToProject = async (req, res) => {
  try {
    const { employeeId, designation } = req.body;
    const { projectId } = req.params;

    if (!employeeId || !designation) {
      return res.status(400).json({
        success: false,
        message: "Employee ID and designation are required",
      });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    if (employee.designation !== designation) {
      return res.status(400).json({
        success: false,
        message: "Employee designation does not match",
      });
    }

    const existingAssignment = await ProjectAssignment.findOne({
  projectId,
  employeeId,
});

if (existingAssignment) {
  if (existingAssignment.status === "ACTIVE") {
    return res.status(409).json({
      success: false,
      message: "Employee is already assigned to this project",
    });
  }

  // Reactivate previous assignment
  existingAssignment.status = "ACTIVE";
  existingAssignment.designation = designation;
  existingAssignment.assignedAt = new Date();

  await existingAssignment.save();

  return res.status(200).json({
    success: true,
    message: "Employee assigned to project successfully",
    assignment: existingAssignment,
  });
}

const assignment = await ProjectAssignment.create({
  projectId,
  employeeId,
  designation,
});

   

    res.status(201).json({
      success: true,
      message: "Employee assigned to project successfully",
      assignment,
    });
  } catch (error) {
    console.error("Assign employee error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to assign employee to project",
    });
  }
};

// Get Employees Assigned to Project
exports.getProjectEmployees = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const assignments = await ProjectAssignment.find({
      projectId,
      status: "ACTIVE",
    })
      .populate("employeeId", "name designation username")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: assignments.length,
      employees: assignments,
    });
  } catch (error) {
    console.error("Get project employees error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get project employees",
    });
  }
};

// Remove Employee from Project
exports.removeEmployeeFromProject = async (req, res) => {
  try {
    const { projectId, employeeId } = req.params;

    const assignment = await ProjectAssignment.findOne({
      projectId,
      employeeId,
      status: "ACTIVE",
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Active employee assignment not found",
      });
    }

    assignment.status = "INACTIVE";

    await assignment.save();

    res.status(200).json({
      success: true,
      message: "Employee removed from project successfully",
    });
  } catch (error) {
    console.error("Remove employee error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to remove employee from project",
    });
  }
};

// Get Projects Assigned to Logged-in Employee
exports.getMyProjects = async (req, res) => {
  try {
    const employeeId = req.employee._id;

    const assignments = await ProjectAssignment.find({
      employeeId,
      status: "ACTIVE",
    })
      .populate("projectId", "title clientName startDate isActive")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: assignments.length,
      projects: assignments,
    });
  } catch (error) {
    console.error("Get my projects error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get assigned projects",
    });
  }
};