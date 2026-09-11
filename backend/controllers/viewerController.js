const Employee = require("../models/Employee");
const Project = require("../models/Project");
const { calculateProjectProgress,
} = require("../services/progressService");
const ProjectAssignment = require("../models/ProjectAssignment");


const {
  getProjectWorkTracking,
} = require("../services/workTrackingService");


exports.getViewerEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({
      isActive: true,
    })
      .select("name designation username")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: employees.length,
      employees,
    });
  } catch (error) {
    console.error("Get viewer employees error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get employees",
    });
  }
};

exports.getViewerProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      isActive: true,
    }).sort({ createdAt: -1 });

    const projectData = [];

    for (const project of projects) {
      const progress = await calculateProjectProgress(project._id);

      projectData.push({
        id: project._id,
        title: project.title,
        clientName: project.clientName,
        startDate: project.startDate,
        totalTasks: progress.totalTasks,
        completedTasks: progress.completedTasks,
        progress: progress.progress,
      });
    }

    res.status(200).json({
      success: true,
      count: projectData.length,
      projects: projectData,
    });
  } catch (error) {
    console.error("Get viewer projects error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get projects",
    });
  }
};

// Get single project for public viewer
exports.getViewerProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findOne({
      _id: projectId,
      isActive: true,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const progress = await calculateProjectProgress(projectId);

    res.status(200).json({
      success: true,
      project: {
        id: project._id,
        title: project.title,
        clientName: project.clientName,
        startDate: project.startDate,
        totalTasks: progress.totalTasks,
        completedTasks: progress.completedTasks,
        progress: progress.progress,
      },
    });
  } catch (error) {
    console.error("Get viewer project error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get project",
    });
  }
};

// Get project employees for public viewer
exports.getViewerProjectEmployees = async (req, res) => {
  try {
    const { projectId } = req.params;

    const assignments = await ProjectAssignment.find({
      projectId,
      status: "ACTIVE",
    })
      .populate("employeeId", "name designation username")
      .sort({ assignedAt: 1 });

    res.status(200).json({
      success: true,
      projectId,
      count: assignments.length,
      employees: assignments.map((assignment) => ({
        employee: assignment.employeeId,
        designation: assignment.designation,
        assignedAt: assignment.assignedAt,
      })),
    });
  } catch (error) {
    console.error("Get viewer project employees error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get project employees",
    });
  }
};


// Get project work tracking for public viewer
exports.getViewerProjectWorkTracking = async (req, res) => {
  try {
    const { projectId } = req.params;

    const data = await getProjectWorkTracking(projectId);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "Get viewer project work tracking error:",
      error
    );

    if (error.message === "Project not found") {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to get project work tracking",
    });
  }
};