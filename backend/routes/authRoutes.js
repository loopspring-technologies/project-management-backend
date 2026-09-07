const express = require("express");

const protect = require("../middleware/authMiddleware");
const { login, getMe, } = require("../controllers/authController");

const router = express.Router();

router.post("/login", login);
router.get("/me", protect, getMe);

module.exports = router;