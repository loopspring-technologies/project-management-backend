const express = require("express");

const {
  createTask, getModuleTasks, getTaskById, updateTask, deleteTask, bookTask, startTask, completeTask,
 revokeTask, } = require("../controllers/taskController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router({ mergeParams: true });

router.post("/", createTask);
router.get("/", getModuleTasks);
router.get("/:taskId", getTaskById);
router.put("/:taskId", updateTask);
router.delete("/:taskId", deleteTask);
router.post("/:taskId/book", protect, bookTask);
router.post("/:taskId/start", protect, startTask);
router.post("/:taskId/complete", protect, completeTask);
router.post("/:taskId/revoke", protect, revokeTask);


module.exports = router;