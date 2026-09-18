const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    designation: {
      type: String,
      required: true,
      enum: [
        "System Admin",
        "Designing",
        "Developer",
        "Frontend",
        "Backend",
        "Database",
        "Testing",
        "Hosting",
      ],
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
  type: String,
  enum: ["ADMIN", "EMPLOYEE"],
  default: "EMPLOYEE",
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

module.exports = mongoose.model("Employee", employeeSchema);