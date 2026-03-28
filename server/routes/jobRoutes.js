const express = require("express");
const router = express.Router();
const {
  createJob,
  getAllJobs,
  getApprovedJobs,
  getEmployerJobs,
  getJobById,
  updateJob,
  deleteJob,
  approveJob,
} = require("../controllers/jobController");
const { protect, authorizeRoles } = require("../middleware/auth");

router.get("/approved", getApprovedJobs);
router.get("/employer", protect, authorizeRoles("employer"), getEmployerJobs);
router.get("/", protect, authorizeRoles("coordinator", "recruiter"), getAllJobs);
router.post("/", protect, authorizeRoles("employer"), createJob);
router.get("/:id", protect, getJobById);
router.put("/:id", protect, authorizeRoles("employer"), updateJob);
router.delete(
  "/:id",
  protect,
  authorizeRoles("employer", "coordinator"),
  deleteJob
);
router.put(
  "/:id/approve",
  protect,
  authorizeRoles("coordinator"),
  approveJob
);

module.exports = router;
