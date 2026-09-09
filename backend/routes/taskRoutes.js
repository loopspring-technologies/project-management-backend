const express = require("express");

const {
  createTask, getModuleTasks, getTaskById, updateTask, deleteTask, bookTask,
} = require("../controllers/taskController");
const protect = require("../middleware/authMiddleware");

const router = express.Router({ mergeParams: true });

router.post("/", createTask);
router.get("/", getModuleTasks);
router.get("/:taskId", getTaskById);
router.put("/:taskId", updateTask);
router.delete("/:taskId", deleteTask);
router.post("/:taskId/book", protect, bookTask);

module.exports = router;