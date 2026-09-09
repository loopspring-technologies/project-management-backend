const express = require("express");

const {
  createModule,
  getProjectModules,
  getModuleById,
  updateModule,
  deleteModule,
} = require("../controllers/moduleController");

const router = express.Router({ mergeParams: true });

router.post("/", createModule);
router.get("/", getProjectModules);
router.get("/:moduleId", getModuleById);
router.put("/:moduleId", updateModule);
router.delete("/:moduleId", deleteModule);

module.exports = router;