# Applicant Tracking System (ATS) - Job Portal

A full-stack MERN application that digitizes the end-to-end hiring process — from job creation and multi-stage approval to candidate applications and recruiter screening.

## Features

- **4 User Roles** — Candidate, Employer, Coordinator, Recruiter with role-specific dashboards
- **JWT Authentication** — Secure login with httpOnly cookies and bcrypt password hashing
- **Multi-Stage Job Approval** — R1/R2 form checks by Coordinators before jobs go live
- **Hiring Pipeline** — Applied → Shortlisted → R1 Cleared → R2 Cleared → Hired/Rejected
- **22 REST API Endpoints** — Complete CRUD for jobs, applications, and user management
- **Role-Based Access Control** — Middleware-based authorization on both frontend and backend
- **Redux State Management** — Centralized store with async thunks for API calls
- **Responsive UI** — Built with Tailwind CSS for all screen sizes

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Redux Toolkit, Tailwind CSS, React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT (JSON Web Tokens), Bcrypt.js |

## Project Structure

```
ATS-Job-Portal/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Navbar, ProtectedRoute, JobCard, etc.
│   │   ├── pages/          # Login, Register, 4 Role Dashboards
│   │   ├── redux/          # Store, authSlice, jobSlice, applicationSlice
│   │   └── App.jsx         # Routes configuration
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Express Backend
│   ├── config/             # Database connection
│   ├── controllers/        # Auth, Job, Application controllers
│   ├── middleware/          # JWT auth & role authorization
│   ├── models/             # User, Job, Application schemas
│   ├── routes/             # API route definitions
│   ├── server.js           # Entry point
│   └── package.json
```

## Database Schema

### Users Collection
| Field | Type | Description |
|-------|------|-------------|
| name | String | User's full name |
| email | String | Unique email address |
| password | String | Bcrypt hashed password |
| role | Enum | candidate / employer / coordinator / recruiter |
| avatar | String | Profile picture URL |

### Jobs Collection
| Field | Type | Description |
|-------|------|-------------|
| title | String | Job title |
| description | String | Job description |
| company | String | Company name |
| location | String | Job location |
| salary | String | Salary range |
| requirements | Array | List of requirements |
| employer | ObjectId | Reference to User |
| status | Enum | draft / pending_approval / approved / rejected / closed |
| R1Approved | Boolean | Coordinator R1 check status |
| R2Approved | Boolean | Coordinator R2 check status |

### Applications Collection
| Field | Type | Description |
|-------|------|-------------|
| job | ObjectId | Reference to Job |
| candidate | ObjectId | Reference to User |
| status | Enum | applied / shortlisted / r1_cleared / r2_cleared / hired / rejected |
| R1Score | Number | Score from R1 round (0-100) |
| R2Score | Number | Score from R2 round (0-100) |
| screenedBy | ObjectId | Reference to Recruiter |

## API Endpoints

### Authentication (5 endpoints)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login and get JWT |
| POST | `/api/auth/logout` | Auth | Clear JWT cookie |
| GET | `/api/auth/profile` | Auth | Get user profile |
| PUT | `/api/auth/profile` | Auth | Update profile |

### Jobs (8 endpoints)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/jobs` | Employer | Create job posting |
| GET | `/api/jobs` | Coordinator | Get all jobs |
| GET | `/api/jobs/approved` | Candidate | Get approved jobs |
| GET | `/api/jobs/my-jobs` | Employer | Get own jobs |
| GET | `/api/jobs/:id` | Auth | Get job details |
| PUT | `/api/jobs/:id` | Employer | Update job |
| DELETE | `/api/jobs/:id` | Employer | Delete job |
| PUT | `/api/jobs/:id/approve` | Coordinator | Approve/reject with R1/R2 |

### Applications (9 endpoints)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/applications/:jobId/apply` | Candidate | Apply to job |
| GET | `/api/applications/my-applications` | Candidate | View my applications |
| GET | `/api/applications/job/:jobId` | Recruiter | View job applications |
| PUT | `/api/applications/:id/shortlist` | Recruiter | Shortlist candidate |
| PUT | `/api/applications/:id/r1` | Recruiter | Update R1 status/score |
| PUT | `/api/applications/:id/r2` | Recruiter | Update R2 status/score |
| PUT | `/api/applications/:id/hire` | Recruiter | Hire candidate |
| PUT | `/api/applications/:id/reject` | Recruiter | Reject candidate |
| GET | `/api/applications/shortlisted` | Recruiter | Get shortlisted list |

## Hiring Pipeline Flow

```
EMPLOYER creates job (status: pending_approval)
        ↓
COORDINATOR reviews → R1 Check → R2 Check → Approves (status: approved)
        ↓
CANDIDATE browses approved jobs → Applies (status: applied)
        ↓
RECRUITER screens:
  → Shortlist (status: shortlisted)
    → R1 Round + Score (status: r1_cleared)
      → R2 Round + Score (status: r2_cleared)
        → Hire (status: hired) or Reject (status: rejected)
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (free) or local MongoDB

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Krity2004/ATS-Job-Portal.git
   cd ATS-Job-Portal
   ```

2. **Set up the backend**
   ```bash
   cd server
   npm install
   cp .env.example .env
   ```
   Edit `.env` and add your MongoDB URI and JWT secret:
   ```
   MONGO_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/ats-portal
   JWT_SECRET=your-secret-key
   PORT=5000
   ```

3. **Set up the frontend**
   ```bash
   cd ../client
   npm install
   ```

4. **Run the application**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev

   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

## How to Test

Register 4 users with different roles and follow the hiring pipeline:

1. **Employer** → Create a job posting
2. **Coordinator** → Approve the job (R1 + R2 checks)
3. **Candidate** → Browse and apply to the approved job
4. **Recruiter** → Shortlist → R1 score → R2 score → Hire

## Security Features

- Passwords hashed with **bcrypt** (10 salt rounds)
- JWT stored in **httpOnly cookies** (prevents XSS token theft)
- **Role-based middleware** on every protected endpoint
- **CORS** configured with specific origin and credentials
- Password field excluded from queries (`select: false`)

## Future Improvements

- Email notifications on application status changes
- Resume upload to AWS S3
- Advanced job search with filters
- Pagination for large datasets
- Analytics dashboard for hiring metrics
- Rate limiting for API protection
