import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginForm } from './features/auth/components/LoginForm';
import { RegisterForm } from './features/auth/components/RegisterForm';
import { OTPForm } from './features/auth/components/OTPForm';
import { Dashboard } from './features/auth/components/Dashboard';
import { CourseCatalogue } from './features/courses/components/CourseCatalogue';
import { CourseDetail } from './features/courses/components/CourseDetail';
import { LessonViewer } from './features/courses/components/LessonViewer';
import { CoursesLayout } from './components/layout/CoursesLayout';
import { useAuth } from './features/auth/hooks/useAuth';
import { useEffect } from 'react';

function App() {
  const { fetchUser, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      fetchUser().catch(() => {
        // User is not logged in, ignore
      });
    }
  }, [fetchUser, isAuthenticated]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/courses" replace />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/verify-otp" element={<OTPForm />} />
        
        {/* Layout for Course pages (Public) */}
        <Route path="/courses" element={<CoursesLayout />}>
          <Route index element={<CourseCatalogue />} />
          <Route path=":id" element={<CourseDetail />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses/:id/lessons/:lessonId" element={<LessonViewer />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;