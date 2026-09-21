const Project = require("../models/Project");
const {
  calculateProjectProgress,
  calculateDesignationProgress,
} = require("../services/progressService");
const ProjectAssignment = require("../models/ProjectAssignment");
const Employee = require("../models/Employee");

// Create Project
exports.createProject = async (req, res) => {
  try {
    const { title, clientName, deadLine } = req.body;

    // Check required fields
    if (!title || !deadLine) {
      return res.status(400).json({
        success: false,
        message: "Project title and start date are required",
      });
    }

    // Create project
    const project = await Project.create({
      title,
      clientName,
      deadLine,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error("Create project error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create project",
    });
  }
};

// Get All Projects with Pagination and Progress
exports.getProjects = async (req, res) => {
  try {
    let { page = 1, limit = 6 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    if (isNaN(page) || page < 1) {
      page = 1;
    }

    if (isNaN(limit) || limit < 1 || limit > 100) {
      limit = 6;
    }

    const skip = (page - 1) * limit;

    const projects = await Project.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProjects = await Project.countDocuments();
    const totalPages = Math.ceil(totalProjects / limit);

    const projectsWithProgress = await Promise.all(
      projects.map(async (project) => {
        const progress = await calculateProjectProgress(project._id);

        return {
          ...project.toObject(),
          progress,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: projectsWithProgress.length,

      pagination: {
        currentPage: page,
        limit,
        totalProjects,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },

      projects: projectsWithProgress,
    });
  } catch (error) {
    console.error("Get projects error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get projects",
    });
  }
};

// Get Single Project
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("Get project error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get project",
    });
  }
};

// Update Project
exports.updateProject = async (req, res) => {
  try {
    const { title, clientName, deadLine } = req.body;

    if (!title || !deadLine) {
      return res.status(400).json({
        success: false,
        message: "Project title and start date are required",
      });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    project.title = title;
    project.clientName = clientName;
    project.deadLine = deadLine;

    await project.save();

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    console.error("Update project error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update project",
    });
  }
};

// Delete Project
exports.deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const assignedEmployees = await ProjectAssignment.countDocuments({
      projectId: projectId,
      status: "ACTIVE",
    });

    if (assignedEmployees > 0) {
      return res.status(400).json({
        success: false,
        canDelete: false,
        message: "This project is assigned to employees.",
      });
    }

    await Project.findByIdAndDelete(projectId);

    res.status(200).json({
      success: true,
      canDelete: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete project error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete project",
    });
  }
};

const DESIGNATIONS = [
  "Designing",
  "Frontend",
  "Backend",
  "Database",
  "Testing",
  "Hosting",
];

// Get all designations with employees and progress
exports.getProjectDesignations = async (req, res) => {
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
    }).populate("employeeId", "name designation username");

    const assignedEmployeeIds = assignments.map(
      (assignment) => assignment.employeeId._id
    );

    const availableEmployees = await Employee.find({
      _id: {
        $nin: assignedEmployeeIds,
      },
      isActive: true,
    })
      .select("name designation username")
      .sort({ name: 1 });

    const designationProgress = await calculateDesignationProgress(
      projectId
    );

    const designations = DESIGNATIONS.map((designation) => {
      const assignedEmployees = assignments
        .filter(
          (assignment) =>
            assignment.designation.toLowerCase() ===
            designation.toLowerCase()
        )
        .map((assignment) => assignment.employeeId);

      const designationAvailableEmployees = availableEmployees.filter(
        (employee) =>
          employee.designation.toLowerCase() ===
          designation.toLowerCase()
      );

      return {
        designation,

        progress: designationProgress[designation] || {
          totalTasks: 0,
          completedTasks: 0,
          progress: 0,
        },

        assignedEmployees,

        availableEmployees: designationAvailableEmployees,
      };
    });

    res.status(200).json({
      success: true,
      projectId,
      designations,
    });
  } catch (error) {
    console.error("Get project designations error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get project designations",
    });
  }
};