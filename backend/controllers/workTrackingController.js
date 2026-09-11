const { getProjectWorkTracking,} = require("../services/workTrackingService");

exports.getProjectWorkTracking = async (req, res) => {
  try {
    const { projectId } = req.params;
    const data = await getProjectWorkTracking(projectId);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get project work tracking error:", error);

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