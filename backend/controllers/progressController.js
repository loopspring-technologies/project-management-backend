const Project = require("../models/Project");
const {
  calculateModuleProgress,
  calculateProjectProgress,
  calculateDesignationProgress,
} = require("../services/progressService");

exports.getModuleProgress = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const progress = await calculateModuleProgress(moduleId);

    res.status(200).json({
      success: true,
      moduleId,
      progress,
    });
  } catch (error) {
    console.error("Get module progress error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to calculate module progress",
    });
  }
};

exports.getProjectProgress = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const progress = await calculateProjectProgress(projectId);

    res.status(200).json({
      success: true,
      projectId,
      projectName: project.title,
      deadLine: project.deadLine,
      progress,
    });
  } catch (error) {
    console.error("Get project progress error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to calculate project progress",
    });
  }
};

exports.getDesignationProgress = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const progress = await calculateDesignationProgress(projectId);

    res.status(200).json({
      success: true,
      projectId,
      projectName: project.title,
      deadLine: project.deadLine,
      progress,
    });
  } catch (error) {
    console.error("Get designation progress error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to calculate designation progress",
    });
  }
};