const Project = require("../models/Project");
const Module = require("../models/Module");
const Task = require("../models/Task");

const DESIGNATIONS = [
  "Designing",
  "Frontend",
  "Backend",
  "Database",
  "Testing",
  "Hosting",
];

const getProjectWorkTracking = async (projectId) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  const modules = await Module.find({
    projectId,
    isActive: true,
  }).sort({ createdAt: 1 });

  const designations = DESIGNATIONS.map((designation) => ({
    designation: designation,
    modules: [],
    totalTasks: 0,
    completedTasks: 0,
    progress: 0,
  }));

  for (const module of modules) {
    const tasks = await Task.find({
      moduleId: module._id,
      isActive: true,
    })
      .populate("bookedBy", "name designation username")
      .sort({ createdAt: 1 });

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(
      (task) => task.status === "COMPLETED"
    ).length;

    const progress = totalTasks === 0 ? 0
        : Math.round((completedTasks / totalTasks) * 100);

    const moduleData = {
      id: module._id,
      name: module.name,
      designation: module.designation,
      totalTasks,
      completedTasks,
      progress,
      tasks,
    };

    const designationSection = designations.find(
  (item) => item.designation === module.designation
);

    if (designationSection) {
      designationSection.modules.push(moduleData);

      designationSection.totalTasks += totalTasks;
      designationSection.completedTasks += completedTasks;
    }
  }

  for (const designation of designations) {
    designation.progress = designation.totalTasks === 0
        ? 0
        : Math.round(
            (designation.completedTasks / designation.totalTasks) * 100
          );
  }

  const totalTasks = designations.reduce(
    (total, designation) => total + designation.totalTasks,
    0
  );

  const completedTasks = designations.reduce(
    (total, designation) => total + designation.completedTasks,
    0
  );

  const progress = totalTasks === 0 ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  return {
    project: {
      id: project._id,
      title: project.title,
      clientName: project.clientName,
      startDate: project.startDate,
    },
    totalTasks,
    completedTasks,
    progress,
    designations,
  };
};

module.exports = { getProjectWorkTracking, };