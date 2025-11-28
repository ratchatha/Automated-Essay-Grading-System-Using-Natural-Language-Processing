import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

function LoginForm() {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('/api/auth/login',
        { studentId, password }
      );
      const data = res.data;
      login(data.token);
      const decoded = jwtDecode(data.token);
      const role = decoded.role;

      alert('เข้าสู่ระบบสำเร็จ');
      navigate(role === 'admin' ? '/dashboard' : '/home');

    } catch (err) {
      const errorMsg = err.response?.data?.error || 'เข้าสู่ระบบไม่สำเร็จ';
      alert(errorMsg);
      console.error('การเข้าสู่ระบบล้มเหลว', err);
    }
  };



  return (
    <div className="flex-grow flex items-center justify-center bg-gray-0 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-[#292524] mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#292524]">Username</label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3563E9]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#292524]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3563E9]"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#292524] text-white py-2 rounded-md hover:bg-[#44403c] transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
