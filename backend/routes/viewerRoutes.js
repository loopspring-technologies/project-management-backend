const express = require("express");

const { getViewerEmployees, getViewerProjects, getViewerProjectById,
    getViewerProjectEmployees, getViewerProjectWorkTracking,
} = require("../controllers/viewerController");



const router = express.Router();

router.get("/employees", getViewerEmployees);
router.get("/projects", getViewerProjects);
router.get("/projects/:projectId", getViewerProjectById);
router.get( "/projects/:projectId/employees", getViewerProjectEmployees);
router.get( "/projects/:projectId/work-tracking", getViewerProjectWorkTracking);

module.exports = router;