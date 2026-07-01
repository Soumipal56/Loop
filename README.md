# Tattvera E-Learning Platform

A full-stack e-learning platform built with React, Node.js, Express, and MongoDB. This project implements a modern tech stack to provide seamless authentication, course browsing, enrollment, and progress tracking for students.

## Features Completed

### 1. Project Setup & Authentication
- **Frontend:** React (Vite) with TypeScript, styled using Tailwind CSS and `shadcn/ui` components.
- **Backend:** Node.js with Express and TypeScript.
- **Authentication:** Secure email OTP-based authentication. The system uses HTTP-only JWT cookies for managing sessions securely, ensuring central route protection (unauthenticated users attempting to access protected routes are redirected to `/login`).

### 2. Database & Data Layer
- **Database:** MongoDB (using Mongoose ODM).
- **Schema Design:** Implemented highly relational models:
  - `User`: Handles auth and profile data.
  - `Course`: Stores course metadata (title, description, price).
  - `Chapter`: Groups lessons together and belongs to a specific course.
  - `Lesson`: Contains individual video/text content and duration.
  - `Enrollment`: Tracks which user is enrolled in which course, and meticulously tracks lesson completion and overall progress.
- **Data Layer:** All database operations are strictly managed through the Node.js backend controllers; the frontend has zero direct DB access.

### 3. Course Browsing & Enrollment
- **Course Catalogue (`/courses`):** A public, beautifully styled, and responsive page listing all available courses fetched dynamically from the backend API.
- **Course Detail (`/courses/[id]`):** A detailed public view displaying the full curriculum (chapters and individual lessons). 
  - Shows an **"Enroll"** button for unenrolled users (prompting unauthenticated users to log in).
  - Shows a **"Continue learning"** button that routes directly to the first lesson for successfully enrolled users.
  - Lessons in the curriculum are only clickable if the user is actively enrolled.

### 4. Student Dashboard
- **Dashboard (`/dashboard`):** An auth-protected portal showing all courses a student is actively enrolled in. Displays real-time progress indicators (e.g., progress percentage and completed lessons calculation) taking the real names from the database, filtering out orphaned data.
- **Lesson Viewer (`/courses/[id]/lessons/[lessonId]`):** An isolated, protected page where enrolled students can consume lesson material. Features a reactive **"Mark as Complete"** button that interacts with the backend to update the user's progress dynamically and disables itself once marked complete.

---

## Local Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally or a MongoDB Atlas URI

### Environment Variables

Before running the backend, create a `.env` file in the `Backend` directory and define the following variables:

```env
PORT=5000                                       # Port for the backend server
MONGODB_URI=mongodb://localhost:27017/tattvera  # MongoDB connection string
JWT_SECRET=your_super_secret_jwt_key            # Secret key for JWT signing
EMAIL_USER=your_email@gmail.com                 # Email used for sending OTPs
EMAIL_PASS=your_email_app_password              # App password for the email provider
FRONTEND_URL=http://localhost:5173              # URL of the frontend client
```

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd Tattvera
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd Backend
npm install
```
Start the development server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window, navigate to the frontend directory and install dependencies:
```bash
cd Frontend
npm install
```
Start the Vite development server:
```bash
npm run dev
```
The app will be accessible at `http://localhost:5173`.

### 4. Seeding Data (Optional)
To quickly populate your database with dummy courses for testing the UI, run the provided seed script:
```bash
cd Backend
npx tsx src/scripts/seedCourses.ts
```

## Architecture Notes
- State management on the client is structured cleanly using **Redux Toolkit**.
- API calls are managed via a centralized Axios instance configured with `withCredentials: true` to handle HTTP-only JWT cookies seamlessly without manual token storage.
- Protected client-side routes are managed through a central `<ProtectedRoute />` wrapper that observes the global Redux authentication state.

## Known Limitations
- **Email OTP Delivery:** The OTP feature relies on standard SMTP (e.g., Nodemailer with Gmail). If you use a standard Gmail account, you must generate and use an App Password rather than your standard password, or the emails will fail to send.
- **Video Hosting:** Lessons currently display placeholder video content or expect public/external URLs (like YouTube/Vimeo embed links or direct `.mp4` URLs). There is no native video hosting integrated yet.
- **Payment Processing:** While courses have a `price` attribute displayed in the UI, Stripe or other payment gateways are not yet integrated. Currently, clicking "Enroll" automatically enrolls the user without triggering a checkout flow.
