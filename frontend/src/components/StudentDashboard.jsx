// frontend/src/components/StudentDashboard.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function StudentDashboard({ setUserRole }) {
  const [profile, setProfile] = useState({ name: '', email: '', course: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/students/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setProfile(res.data);
    } catch (err) {
      console.error('Fetch profile error:', err.response?.data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      console.log('Update profile payload:', profile);
      console.log('Token:', token);
      await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/students/profile`, profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Profile updated');
    } catch (err) {
      console.error('AxiosError:', err);
      console.error('Response:', err.response?.data);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUserRole(null);
    navigate('/login');
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Student Dashboard</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={profile.email}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          placeholder="Course"
          value={profile.course}
          onChange={(e) => setProfile({ ...profile, course: e.target.value })}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
}

export default StudentDashboard;