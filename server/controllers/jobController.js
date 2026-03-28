const Job = require("../models/Job");

// POST /api/jobs - Employer creates a job
const createJob = async (req, res) => {
  try {
    const { title, description, company, location, salary, type, requirements } =
      req.body;

    if (!title || !description || !company || !location) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const job = await Job.create({
      title,
      description,
      company,
      location,
      salary: salary || "Not disclosed",
      type: type || "full-time",
      requirements: requirements || [],
      employer: req.user._id,
      status: "pending_approval",
    });

    res.status(201).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/jobs - Get all jobs (admin/coordinator view)
const getAllJobs = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate("employer", "name email")
      .populate("approvedBy", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      jobs,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/jobs/approved - Get approved jobs (public/candidate view)
const getApprovedJobs = async (req, res) => {
  try {
    const { search, type, location, page = 1, limit = 10 } = req.query;
    const query = { status: "approved" };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }
    if (type) query.type = type;
    if (location) query.location = { $regex: location, $options: "i" };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate("employer", "name email company")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      jobs,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/jobs/employer - Get jobs created by current employer
const getEmployerJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user._id })
      .populate("approvedBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/jobs/:id
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("employer", "name email")
      .populate("approvedBy", "name");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/jobs/:id - Employer updates their job
const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this job" });
    }

    const { title, description, company, location, salary, type, requirements, status } =
      req.body;

    if (title) job.title = title;
    if (description) job.description = description;
    if (company) job.company = company;
    if (location) job.location = location;
    if (salary) job.salary = salary;
    if (type) job.type = type;
    if (requirements) job.requirements = requirements;
    if (status && ["draft", "pending_approval", "closed"].includes(status)) {
      job.status = status;
    }

    await job.save();
    res.status(200).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE /api/jobs/:id
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (
      job.employer.toString() !== req.user._id.toString() &&
      req.user.role !== "coordinator"
    ) {
      return res.status(403).json({ message: "Not authorized to delete this job" });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Job deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/jobs/:id/approve - Coordinator approves/rejects a job + R1/R2 checks
const approveJob = async (req, res) => {
  try {
    const { status, R1Approved, R2Approved } = req.body;

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (status && ["approved", "rejected"].includes(status)) {
      job.status = status;
      job.approvedBy = req.user._id;
    }

    if (typeof R1Approved === "boolean") job.R1Approved = R1Approved;
    if (typeof R2Approved === "boolean") job.R2Approved = R2Approved;

    await job.save();
    await job.populate("employer", "name email");
    await job.populate("approvedBy", "name");

    res.status(200).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getApprovedJobs,
  getEmployerJobs,
  getJobById,
  updateJob,
  deleteJob,
  approveJob,
};
