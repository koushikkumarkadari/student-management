import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminDashboard({ setUserRole }) {
  const [students, setStudents] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ userId: '', name: '', email: '', course: '' });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
    fetchUsers();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/students`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setStudents(res.data);
    } catch (err) {
      console.error('Fetch students error:', err.response?.data);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Fetch users error:', err.response?.data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      console.log('Payload:', form);
      console.log('Token:', token);
      if (editingId) {
        await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/students/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditingId(null);
      } else {
        await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/students`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setForm({ userId: '', name: '', email: '', course: '' });
      fetchStudents();
    } catch (err) {
      console.error('AxiosError:', err);
      console.error('Response:', err.response?.data);
    }
  };

  const handleEdit = (student) => {
    setForm({ userId: student.userId, name: student.name, email: student.email, course: student.course });
    setEditingId(student._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/students/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchStudents();
    } catch (err) {
      console.error('Delete error:', err.response?.data);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUserRole(null);
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <select
          value={form.userId}
          onChange={(e) => setForm({ ...form, userId: e.target.value })}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          placeholder="Course"
          value={form.course}
          onChange={(e) => setForm({ ...form, course: e.target.value })}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition"
        >
          {editingId ? 'Update' : 'Add'} Student
        </button>
      </form>
      <h3 className="text-xl font-semibold mb-4">Student List</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-3 text-left">Name</th>
              <th className="border p-3 text-left">Email</th>
              <th className="border p-3 text-left">Course</th>
              <th className="border p-3 text-left">Enrollment Date</th>
              <th className="border p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id} className="hover:bg-gray-50">
                <td className="border p-3">{student.name}</td>
                <td className="border p-3">{student.email}</td>
                <td className="border p-3">{student.course}</td>
                <td className="border p-3">{new Date(student.enrollmentDate).toLocaleDateString()}</td>
                <td className="border p-3 space-x-2">
                  <button
                    onClick={() => handleEdit(student)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(student._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;