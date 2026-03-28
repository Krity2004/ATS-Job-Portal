import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "/api/applications";

const getAuthHeader = (getState) => {
  const token = getState().auth.token;
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const applyToJob = createAsyncThunk(
  "applications/apply",
  async ({ jobId, data }, { getState, rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API_URL}/${jobId}`,
        data,
        getAuthHeader(getState)
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to apply"
      );
    }
  }
);

export const fetchMyApplications = createAsyncThunk(
  "applications/fetchMy",
  async (_, { getState, rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/my`, getAuthHeader(getState));
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch applications"
      );
    }
  }
);

export const fetchJobApplications = createAsyncThunk(
  "applications/fetchByJob",
  async ({ jobId, status }, { getState, rejectWithValue }) => {
    try {
      const query = status ? `?status=${status}` : "";
      const res = await axios.get(
        `${API_URL}/job/${jobId}${query}`,
        getAuthHeader(getState)
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch applications"
      );
    }
  }
);

export const fetchShortlistedCandidates = createAsyncThunk(
  "applications/fetchShortlisted",
  async (_, { getState, rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${API_URL}/shortlisted`,
        getAuthHeader(getState)
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch shortlisted"
      );
    }
  }
);

export const shortlistCandidate = createAsyncThunk(
  "applications/shortlist",
  async ({ id, notes }, { getState, rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${API_URL}/${id}/shortlist`,
        { notes },
        getAuthHeader(getState)
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to shortlist"
      );
    }
  }
);

export const updateR1Status = createAsyncThunk(
  "applications/updateR1",
  async ({ id, R1Score, notes }, { getState, rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${API_URL}/${id}/r1`,
        { R1Score, notes },
        getAuthHeader(getState)
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update R1"
      );
    }
  }
);

export const updateR2Status = createAsyncThunk(
  "applications/updateR2",
  async ({ id, R2Score, notes }, { getState, rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${API_URL}/${id}/r2`,
        { R2Score, notes },
        getAuthHeader(getState)
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update R2"
      );
    }
  }
);

export const hireCandidate = createAsyncThunk(
  "applications/hire",
  async ({ id, notes }, { getState, rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${API_URL}/${id}/hire`,
        { notes },
        getAuthHeader(getState)
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to hire"
      );
    }
  }
);

export const rejectCandidate = createAsyncThunk(
  "applications/reject",
  async ({ id, notes }, { getState, rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${API_URL}/${id}/reject`,
        { notes },
        getAuthHeader(getState)
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to reject"
      );
    }
  }
);

const applicationSlice = createSlice({
  name: "applications",
  initialState: {
    applications: [],
    shortlisted: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearAppError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(applyToJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyToJob.fulfilled, (state, action) => {
        state.loading = false;
        state.applications.unshift(action.payload.application);
      })
      .addCase(applyToJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload.applications;
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchJobApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload.applications;
      })
      .addCase(fetchJobApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchShortlistedCandidates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShortlistedCandidates.fulfilled, (state, action) => {
        state.loading = false;
        state.shortlisted = action.payload.applications;
      })
      .addCase(fetchShortlistedCandidates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(shortlistCandidate.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.applications.findIndex(
          (a) => a._id === action.payload.application._id
        );
        if (idx !== -1) state.applications[idx] = action.payload.application;
      })
      .addCase(updateR1Status.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.applications.findIndex(
          (a) => a._id === action.payload.application._id
        );
        if (idx !== -1) state.applications[idx] = action.payload.application;
        const sIdx = state.shortlisted.findIndex(
          (a) => a._id === action.payload.application._id
        );
        if (sIdx !== -1)
          state.shortlisted[sIdx] = action.payload.application;
      })
      .addCase(updateR2Status.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.applications.findIndex(
          (a) => a._id === action.payload.application._id
        );
        if (idx !== -1) state.applications[idx] = action.payload.application;
        const sIdx = state.shortlisted.findIndex(
          (a) => a._id === action.payload.application._id
        );
        if (sIdx !== -1)
          state.shortlisted[sIdx] = action.payload.application;
      })
      .addCase(hireCandidate.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.applications.findIndex(
          (a) => a._id === action.payload.application._id
        );
        if (idx !== -1) state.applications[idx] = action.payload.application;
      })
      .addCase(rejectCandidate.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.applications.findIndex(
          (a) => a._id === action.payload.application._id
        );
        if (idx !== -1) state.applications[idx] = action.payload.application;
      });
  },
});

export const { clearAppError } = applicationSlice.actions;
export default applicationSlice.reducer;
