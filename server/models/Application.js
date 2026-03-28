const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "applied",
        "shortlisted",
        "r1_cleared",
        "r2_cleared",
        "hired",
        "rejected",
      ],
      default: "applied",
    },
    resume: {
      type: String,
      default: "",
    },
    coverLetter: {
      type: String,
      default: "",
      maxlength: 3000,
    },
    R1Score: {
      type: Number,
      default: null,
      min: 0,
      max: 100,
    },
    R2Score: {
      type: Number,
      default: null,
      min: 0,
      max: 100,
    },
    screenedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    notes: {
      type: String,
      default: "",
      maxlength: 2000,
    },
  },
  { timestamps: true }
);

applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
