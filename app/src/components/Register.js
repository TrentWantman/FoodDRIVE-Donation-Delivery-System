import React, { useState } from 'react';
import { register } from '../services/authService';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    accountType: 'driver',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await register(formData);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response.data.msg || 'Registration failed');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={onSubmit}>
        <input
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={onChange}
          required
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="Password (min 6 characters)"
          value={formData.password}
          onChange={onChange}
          required
        />
        <br />
        <select name="accountType" value={formData.accountType} onChange={onChange}>
          <option value="driver">Driver</option>
          <option value="food bank">Food Bank</option>
          <option value="donor">Donor</option>
        </select>
        <br />
        <button type="submit">Register</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>
        Already have an account? <a href="/">Login here</a>
      </p>
    </div>
  );
}

export default Register;