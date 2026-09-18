const Module = require("../models/Module");
const Project = require("../models/Project");
const Task = require("../models/Task");

exports.createModule = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, designation } = req.body;

    if (!name || !designation) {
      return res.status(400).json({
        success: false,
        message: "Module name and designation are required",
      });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const module = await Module.create({
      projectId,
      name,
      designation,
    });

    res.status(201).json({
      success: true,
      message: "Module created successfully",
      module,
    });
  } catch (error) {
    console.error("Create module error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create module",
    });
  }
};

exports.getProjectModules = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const modules = await Module.find({
      projectId,
      isActive: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: modules.length,
      modules,
    });
  } catch (error) {
    console.error("Get project modules error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get project modules",
    });
  }
};

exports.getModuleById = async (req, res) => {
  try {
    const module = await Module.findById(req.params.moduleId);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    res.status(200).json({
      success: true,
      module,
    });
  } catch (error) {
    console.error("Get module error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get module",
    });
  }
};

exports.updateModule = async (req, res) => {
  try {
    const { name, designation } = req.body;

    if (!name || !designation) {
      return res.status(400).json({
        success: false,
        message: "Module name and designation are required",
      });
    }

    const module = await Module.findById(req.params.moduleId);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    module.name = name;
    module.designation = designation;

    await module.save();

    res.status(200).json({
      success: true,
      message: "Module updated successfully",
      module,
    });
  } catch (error) {
    console.error("Update module error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update module",
    });
  }
};

exports.deleteModule = async (req, res) => {
  try {
    const { moduleId } = req.params;

    const module = await Module.findById(moduleId);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    const ongoingTaskCount = await Task.countDocuments({
      moduleId,
      status: "IN_PROGRESS",
    });

    if (ongoingTaskCount > 0) {
      return res.status(400).json({
        success: false,
        canDelete: false,
        isOngoing: true,
        ongoingTaskCount,
        message:
          "This module has an ongoing task. Please delete the task before deleting the module.",
      });
    }

    const deletedTasks = await Task.deleteMany({
      moduleId,
    });

    await Module.findByIdAndDelete(moduleId);

    res.status(200).json({
      success: true,
      canDelete: true,
      message: "Module and all its tasks deleted successfully",
      deletedTasks: deletedTasks.deletedCount,
    });
  } catch (error) {
    console.error("Delete module error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete module",
    });
  }
};

// Get modules by project and designation
exports.getModulesByDesignation = async (req, res) => {
  try {
    const { projectId, designation } = req.params;

    const modules = await Module.find({
      projectId,
      designation: designation,
      isActive: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Modules fetched successfully",
      projectId,
      designation: designation,
      count: modules.length,
      modules,
    });
  } catch (error) {
    console.error("Get modules by designation error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch modules",
    });
  }
};