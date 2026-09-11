const express = require("express");

const { createModule, getProjectModules, getModuleById,
  updateModule, deleteModule,} = require("../controllers/moduleController");
const { getModuleProgress, } = require("../controllers/progressController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router({ mergeParams: true });

// router.post("/", createModule);
router.post("/", protect, authorizeRoles("ADMIN"), createModule);
router.get("/", getProjectModules);
router.get("/:moduleId/progress", getModuleProgress);
router.get("/:moduleId", getModuleById);
// router.put("/:moduleId", updateModule);
router.put( "/:moduleId", protect, authorizeRoles("ADMIN"), updateModule);
// router.delete("/:moduleId", deleteModule);
router.delete( "/:moduleId", protect, authorizeRoles("ADMIN"), deleteModule);

module.exports = router;