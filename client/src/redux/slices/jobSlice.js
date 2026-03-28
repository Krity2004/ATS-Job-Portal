import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "/api/jobs";

const getAuthHeader = (getState) => {
  const token = getState().auth.token;
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const fetchApprovedJobs = createAsyncThunk(
  "jobs/fetchApproved",
  async (params = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await axios.get(`${API_URL}/approved?${query}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch jobs");
    }
  }
);

export const fetchAllJobs = createAsyncThunk(
  "jobs/fetchAll",
  async (params = {}, { getState, rejectWithValue }) => {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await axios.get(`${API_URL}?${query}`, getAuthHeader(getState));
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch jobs");
    }
  }
);

export const fetchEmployerJobs = createAsyncThunk(
  "jobs/fetchEmployer",
  async (_, { getState, rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/employer`, getAuthHeader(getState));
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch jobs");
    }
  }
);

export const fetchJobById = createAsyncThunk(
  "jobs/fetchById",
  async (id, { getState, rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/${id}`, getAuthHeader(getState));
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch job");
    }
  }
);

export const createJob = createAsyncThunk(
  "jobs/create",
  async (jobData, { getState, rejectWithValue }) => {
    try {
      const res = await axios.post(API_URL, jobData, getAuthHeader(getState));
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create job");
    }
  }
);

export const updateJob = createAsyncThunk(
  "jobs/update",
  async ({ id, data }, { getState, rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, data, getAuthHeader(getState));
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update job");
    }
  }
);

export const deleteJob = createAsyncThunk(
  "jobs/delete",
  async (id, { getState, rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`, getAuthHeader(getState));
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete job");
    }
  }
);

export const approveJob = createAsyncThunk(
  "jobs/approve",
  async ({ id, data }, { getState, rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${API_URL}/${id}/approve`,
        data,
        getAuthHeader(getState)
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to approve job");
    }
  }
);

const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    currentJob: null,
    total: 0,
    pages: 1,
    page: 1,
    loading: false,
    error: null,
  },
  reducers: {
    clearJobError: (state) => {
      state.error = null;
    },
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApprovedJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApprovedJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
        state.page = action.payload.page;
      })
      .addCase(fetchApprovedJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
        state.page = action.payload.page;
      })
      .addCase(fetchAllJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchEmployerJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployerJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs;
      })
      .addCase(fetchEmployerJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJob = action.payload.job;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs.unshift(action.payload.job);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.jobs.findIndex(
          (j) => j._id === action.payload.job._id
        );
        if (idx !== -1) state.jobs[idx] = action.payload.job;
        if (state.currentJob?._id === action.payload.job._id) {
          state.currentJob = action.payload.job;
        }
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter((j) => j._id !== action.payload);
      })
      .addCase(approveJob.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.jobs.findIndex(
          (j) => j._id === action.payload.job._id
        );
        if (idx !== -1) state.jobs[idx] = action.payload.job;
      });
  },
});

export const { clearJobError, clearCurrentJob } = jobSlice.actions;
export default jobSlice.reducer;
