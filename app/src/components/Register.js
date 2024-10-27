// src/components/Register.js

import React, { useState } from 'react';
import { register } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Import your CSS file
import Logo from './Logo';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    accountType: 'driver',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await register(formData);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response.data.msg || 'Registration failed');
    }
  };

  return (
      <div className="register-container">
        <Logo />
        <h2>Create an Account</h2>
        <form onSubmit={onSubmit}>
          <input
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={onChange}
              required
          />
          <input
              type="password"
              name="password"
              placeholder="Password (min 6 characters)"
              value={formData.password}
              onChange={onChange}
              required
          />
          <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={onChange}
              required
          />
          <label htmlFor="accountType">Select Account Type:</label>
          <select name="accountType" value={formData.accountType} onChange={onChange}>
            <option value="driver">Driver</option>
            <option value="food bank">Food Bank</option>
            <option value="donor">Donor</option>
          </select>
          <button type="submit">Register</button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <h3>
          Already have an account? <a href="/">Login here</a>
        </h3>
      </div>
  );
}

export default Register;
