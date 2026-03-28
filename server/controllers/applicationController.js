const Application = require("../models/Application");
const Job = require("../models/Job");

// POST /api/applications/:jobId - Candidate applies to a job
const applyToJob = async (req, res) => {
  try {
    const { resume, coverLetter } = req.body;
    const jobId = req.params.jobId;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.status !== "approved") {
      return res.status(400).json({ message: "This job is not accepting applications" });
    }

    const existingApp = await Application.findOne({
      job: jobId,
      candidate: req.user._id,
    });
    if (existingApp) {
      return res.status(400).json({ message: "You have already applied to this job" });
    }

    const application = await Application.create({
      job: jobId,
      candidate: req.user._id,
      resume: resume || "",
      coverLetter: coverLetter || "",
      status: "applied",
    });

    await application.populate("job", "title company");
    await application.populate("candidate", "name email");

    res.status(201).json({ success: true, application });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/applications/my - Candidate gets their applications
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .populate({
        path: "job",
        select: "title company location type salary status",
        populate: { path: "employer", select: "name" },
      })
      .populate("screenedBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/applications/job/:jobId - Get all applications for a job
const getJobApplications = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { job: req.params.jobId };
    if (status) query.status = status;

    const applications = await Application.find(query)
      .populate("candidate", "name email avatar")
      .populate("screenedBy", "name")
      .populate("job", "title company")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/applications/:id/shortlist - Recruiter shortlists a candidate
const shortlistCandidate = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = "shortlisted";
    application.screenedBy = req.user._id;
    if (req.body.notes) application.notes = req.body.notes;

    await application.save();
    await application.populate("candidate", "name email");
    await application.populate("job", "title company");
    await application.populate("screenedBy", "name");

    res.status(200).json({ success: true, application });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/applications/:id/r1 - Update R1 screening status
const updateR1Status = async (req, res) => {
  try {
    const { R1Score, notes } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.status !== "shortlisted") {
      return res
        .status(400)
        .json({ message: "Candidate must be shortlisted before R1 screening" });
    }

    application.R1Score = R1Score;
    application.status = "r1_cleared";
    application.screenedBy = req.user._id;
    if (notes) application.notes = notes;

    await application.save();
    await application.populate("candidate", "name email");
    await application.populate("job", "title company");

    res.status(200).json({ success: true, application });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/applications/:id/r2 - Update R2 screening status
const updateR2Status = async (req, res) => {
  try {
    const { R2Score, notes } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.status !== "r1_cleared") {
      return res
        .status(400)
        .json({ message: "Candidate must clear R1 before R2 screening" });
    }

    application.R2Score = R2Score;
    application.status = "r2_cleared";
    application.screenedBy = req.user._id;
    if (notes) application.notes = notes;

    await application.save();
    await application.populate("candidate", "name email");
    await application.populate("job", "title company");

    res.status(200).json({ success: true, application });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/applications/:id/hire - Hire a candidate
const hireCandidate = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = "hired";
    application.screenedBy = req.user._id;
    if (req.body.notes) application.notes = req.body.notes;

    await application.save();
    await application.populate("candidate", "name email");
    await application.populate("job", "title company");

    res.status(200).json({ success: true, application });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/applications/:id/reject - Reject a candidate
const rejectCandidate = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = "rejected";
    application.screenedBy = req.user._id;
    if (req.body.notes) application.notes = req.body.notes;

    await application.save();
    await application.populate("candidate", "name email");
    await application.populate("job", "title company");

    res.status(200).json({ success: true, application });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/applications/shortlisted - Get all shortlisted candidates
const getShortlistedCandidates = async (req, res) => {
  try {
    const applications = await Application.find({
      status: { $in: ["shortlisted", "r1_cleared", "r2_cleared"] },
    })
      .populate("candidate", "name email avatar")
      .populate("job", "title company")
      .populate("screenedBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  applyToJob,
  getMyApplications,
  getJobApplications,
  shortlistCandidate,
  updateR1Status,
  updateR2Status,
  hireCandidate,
  rejectCandidate,
  getShortlistedCandidates,
};
