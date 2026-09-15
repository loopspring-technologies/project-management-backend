const express = require("express");

const { createProject, getProjects, getProjectById, updateProject, deleteProject
} = require("../controllers/projectController");
const { getProjectProgress, } = require("../controllers/progressController");
const { getProjectWorkTracking,} = require("../controllers/workTrackingController");
const { getProjectDetails,} = require("../controllers/projectDetailController");

const router = express.Router();

router.post("/", createProject);
router.get("/", getProjects);
router.get("/:projectId/progress", getProjectProgress);
router.get("/:projectId/work-tracking", getProjectWorkTracking);
router.get("/:projectId/details", getProjectDetails);
router.get("/:id", getProjectById);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

module.exports = router;