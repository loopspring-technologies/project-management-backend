const Project = require("../models/Project");
const { calculateProjectProgress,} = require("../services/progressService");
const { getProjectWorkTracking,} = require("../services/workTrackingService");

exports.getProjectDetails = async (req, res) => {
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

    const workTracking = await getProjectWorkTracking(projectId);

    res.status(200).json({
      success: true,

      project: {
        id: project._id,
        title: project.title,
        clientName: project.clientName,
        startDate: project.startDate,
      },

      progress: {
        totalTasks: progress.totalTasks,
        completedTasks: progress.completedTasks,
        percentage: progress.progress,
      },

      designations: workTracking.designations,
    });
  } catch (error) {
    console.error("Get project details error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get project details",
    });
  }
};