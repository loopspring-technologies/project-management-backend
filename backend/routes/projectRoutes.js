const express = require("express");

const {
  createProject, getProjects, getProjectById, updateProject, deleteProject
} = require("../controllers/projectController");
const { getProjectProgress, } = require("../controllers/progressController");

const router = express.Router();

router.post("/", createProject);
router.get("/", getProjects);
router.get("/:projectId/progress", getProjectProgress);
router.get("/:id", getProjectById);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

module.exports = router;