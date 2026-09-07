const jwt = require("jsonwebtoken");
const Employee = require("../models/Employee");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const employee = await Employee.findById(decoded.id).select("-password");

    if (!employee) {
      return res.status(401).json({
        success: false,
        message: "Employee not found",
      });
    }

    if (!employee.isActive) {
      return res.status(403).json({
        success: false,
        message: "Employee account is inactive",
      });
    }

    req.employee = employee;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = protect;