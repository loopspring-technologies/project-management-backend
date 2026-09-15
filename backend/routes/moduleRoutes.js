const express = require("express");

const { createModule, getProjectModules, getModuleById,
  updateModule, deleteModule,} = require("../controllers/moduleController");
const { getModuleProgress, } = require("../controllers/progressController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router({ mergeParams: true });

router.post("/", createModule);
router.get("/", getProjectModules);
router.get("/:moduleId/progress", getModuleProgress);
router.get("/:moduleId", getModuleById);
router.put("/:moduleId", updateModule);
router.delete("/:moduleId", deleteModule);

module.exports = router;