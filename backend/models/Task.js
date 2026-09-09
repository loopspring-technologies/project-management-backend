const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },


    status: {
      type: String,
      enum: [
        "AVAILABLE",
        "BOOKED",
        "IN_PROGRESS",
        "COMPLETED",
      ],
      default: "AVAILABLE",
    },

    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },

    bookedAt: {
      type: Date,
      default: null,
    },

    startedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);