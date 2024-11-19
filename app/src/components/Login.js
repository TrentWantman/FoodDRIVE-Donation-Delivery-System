import React, { useState } from 'react';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import Logo from './Logo';

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(formData);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response.data.msg || 'Login failed');
    }
  };

  return (
      <div className="login-container">
        <Logo />
        <h2>Welcome to FoodDRIVE!<br />Login below:</h2>
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
              placeholder="Password"
              value={formData.password}
              onChange={onChange}
              required
          />
          <button type="submit">Login</button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <h3 className='RegisterText'>
          Don't have an account? <a href="/register">Register here</a>
        </h3>
      </div>
  );
}

export default Login;
