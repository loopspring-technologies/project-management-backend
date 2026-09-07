const mongoose = require("mongoose");

const projectAssignmentSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    designation: {
      type: String,
      required: true,
      enum: [
        "Designing",
        "Frontend",
        "Backend",
        "Database",
        "Testing",
        "Hosting",
      ],
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },

    assignedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

projectAssignmentSchema.index(
  { projectId: 1, employeeId: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "ProjectAssignment",
  projectAssignmentSchema
);