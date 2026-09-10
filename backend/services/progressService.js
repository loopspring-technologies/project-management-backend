const Task = require("../models/Task");
const Module = require("../models/Module");

const calculateModuleProgress = async (moduleId) => {
  const totalTasks = await Task.countDocuments({
    moduleId,
    isActive: true,
  });

  const completedTasks = await Task.countDocuments({
    moduleId,
    status: "COMPLETED",
    isActive: true,
  });

  const progress = totalTasks === 0 ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  return {
    totalTasks,
    completedTasks,
    progress,
  };
};

const calculateProjectProgress = async (projectId) => {
  const modules = await Module.find({
    projectId,
    isActive: true,
  });
  let totalTasks = 0;
  let completedTasks = 0;
  for (const module of modules) {
    const total = await Task.countDocuments({
      moduleId: module._id,
      isActive: true,
    });

    const completed = await Task.countDocuments({
      moduleId: module._id,
      status: "COMPLETED",
      isActive: true,
    });

    totalTasks += total;
    completedTasks += completed;
  }

  const progress = totalTasks === 0 ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  return {
    totalTasks,
    completedTasks,
    progress,
  };
};

module.exports = { calculateModuleProgress, calculateProjectProgress };