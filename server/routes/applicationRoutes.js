const express = require("express");
const router = express.Router();
const {
  applyToJob,
  getMyApplications,
  getJobApplications,
  shortlistCandidate,
  updateR1Status,
  updateR2Status,
  hireCandidate,
  rejectCandidate,
  getShortlistedCandidates,
} = require("../controllers/applicationController");
const { protect, authorizeRoles } = require("../middleware/auth");

router.post(
  "/:jobId",
  protect,
  authorizeRoles("candidate"),
  applyToJob
);
router.get(
  "/my",
  protect,
  authorizeRoles("candidate"),
  getMyApplications
);
router.get(
  "/shortlisted",
  protect,
  authorizeRoles("recruiter", "coordinator"),
  getShortlistedCandidates
);
router.get(
  "/job/:jobId",
  protect,
  authorizeRoles("employer", "recruiter", "coordinator"),
  getJobApplications
);
router.put(
  "/:id/shortlist",
  protect,
  authorizeRoles("recruiter"),
  shortlistCandidate
);
router.put(
  "/:id/r1",
  protect,
  authorizeRoles("recruiter", "coordinator"),
  updateR1Status
);
router.put(
  "/:id/r2",
  protect,
  authorizeRoles("recruiter", "coordinator"),
  updateR2Status
);
router.put(
  "/:id/hire",
  protect,
  authorizeRoles("recruiter"),
  hireCandidate
);
router.put(
  "/:id/reject",
  protect,
  authorizeRoles("recruiter"),
  rejectCandidate
);

module.exports = router;
