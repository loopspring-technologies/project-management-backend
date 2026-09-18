const Task = require("../models/Task");
const Module = require("../models/Module");
const ProjectAssignment = require("../models/ProjectAssignment");

exports.createTask = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Task name is required",
      });
    }

    const module = await Module.findById(moduleId);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    const task = await Task.create({
      moduleId,
      name,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Create task error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create task",
    });
  }
};

exports.getModuleTasks = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const module = await Module.findById(moduleId);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    const tasks = await Task.find({
      moduleId,
      isActive: true,
    })
      .populate("bookedBy", "name designation username")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error("Get module tasks error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get module tasks",
    });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId)
      .populate("bookedBy", "name designation username");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    console.error("Get task error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get task",
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Task name is required",
      });
    }

    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    task.name = name;
    await task.save();

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error("Update task error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update task",
    });
  }
};


exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    await Task.findByIdAndDelete(req.params.taskId);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete task",
    });
  }
};


exports.bookTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const employeeId = req.employee._id;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const module = await Module.findById(task.moduleId);

if (!module) {
  return res.status(404).json({
    success: false,
    message: "Module not found",
  });
}

const assignment = await ProjectAssignment.findOne({
  projectId: module.projectId,
  employeeId,
  status: "ACTIVE",
});

if (!assignment) {
  return res.status(403).json({
    success: false,
    message: "You are not assigned to this project",
  });
}

    if (!task.isActive) {
      return res.status(400).json({
        success: false,
        message: "Task is inactive",
      });
    }

    if (task.status !== "AVAILABLE") {
      return res.status(409).json({
        success: false,
        message: "Task is already booked or completed",
      });
    }

    task.status = "BOOKED";
    task.bookedBy = employeeId;
    task.bookedAt = new Date();

    await task.save();

    const updatedTask = await Task.findById(taskId)
      .populate("bookedBy", "name designation username");

    res.status(200).json({
      success: true,
      message: "Task booked successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Book task error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to book task",
    });
  }
};

exports.startTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const employeeId = req.employee._id;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (!task.isActive) {
      return res.status(400).json({
        success: false,
        message: "Task is inactive",
      });
    }

    if (task.status !== "BOOKED") {
      return res.status(400).json({
        success: false,
        message: "Only booked tasks can be started",
      });
    }

    if (!task.bookedBy || task.bookedBy.toString() !== employeeId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the employee who booked this task can start it",
      });
    }

    task.status = "IN_PROGRESS";
    task.startedAt = new Date();

    await task.save();

    const updatedTask = await Task.findById(taskId)
      .populate("bookedBy", "name designation username");

    res.status(200).json({
      success: true,
      message: "Task started successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Start task error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to start task",
    });
  }
};

exports.completeTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const employeeId = req.employee._id;
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }
    if (!task.isActive) {
      return res.status(400).json({
        success: false,
        message: "Task is inactive",
      });
    }

    if (task.status !== "IN_PROGRESS") {
      return res.status(400).json({
        success: false,
        message: "Only tasks in progress can be completed",
      });
    }

    if (
      !task.bookedBy ||
      task.bookedBy.toString() !== employeeId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Only the employee who booked this task can complete it",
      });
    }

    task.status = "COMPLETED";
    task.completedAt = new Date();
    await task.save();
    const updatedTask = await Task.findById(taskId).populate(
      "bookedBy",
      "name designation username"
    );

    res.status(200).json({
      success: true,
      message: "Task completed successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Complete task error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to complete task",
    });
  }
};

exports.revokeTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const employeeId = req.employee._id;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }
    if (!task.isActive) {
      return res.status(400).json({
        success: false,
        message: "Task is inactive",
      });
    }

    if (
      task.status !== "BOOKED" &&
      task.status !== "IN_PROGRESS"
    ) {
      return res.status(400).json({
        success: false,
        message: "Only booked or in-progress tasks can be revoked",
      });
    }

    if (
      !task.bookedBy ||
      task.bookedBy.toString() !== employeeId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Only the employee who booked this task can revoke it",
      });
    }
    task.status = "AVAILABLE";
    task.bookedBy = null;
    task.bookedAt = null;
    task.startedAt = null;
    task.completedAt = null;
    await task.save();
    const updatedTask = await Task.findById(taskId).populate(
      "bookedBy",
      "name designation username"
    );
    res.status(200).json({
      success: true,
      message: "Task revoked successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Revoke task error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to revoke task",
    });
  }
};

