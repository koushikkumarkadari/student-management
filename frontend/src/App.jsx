// frontend/src/App.jsx
import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';

// ProtectedRoute component
const ProtectedRoute = ({ children, role, userRole }) => {
  if (!localStorage.getItem('token') || userRole !== role) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem('role') || null);

  return (
    <Routes>
      <Route path="/login" element={<Login setUserRole={setUserRole} />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin" userRole={userRole}>
            <AdminDashboard setUserRole={setUserRole} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student"
        element={
          <ProtectedRoute role="student" userRole={userRole}>
            <StudentDashboard setUserRole={setUserRole} />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;