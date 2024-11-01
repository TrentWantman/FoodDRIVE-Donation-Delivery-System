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
  const [isDonorChecked, setIsDonorChecked] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'accountType' && e.target.value !== 'donor') {
      setIsDonorChecked(false); // Uncheck if not donor
    }
  };

  const onCheckboxChange = (e) => {
    setIsDonorChecked(e.target.checked);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.accountType === 'donor' && !isDonorChecked) {
      setError('You must pledge your donation when registering as a donor');
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

        {formData.accountType === 'donor' && (
          <div className="donor-checkbox-container">
            <input
              type="checkbox"
              id="donorCheckbox"
              checked={isDonorChecked}
              onChange={onCheckboxChange}
              required
            />
            <label htmlFor="donorCheckbox" className="donor-checkbox-label">
              I understand that by joining as a donor, I promise to follow through with pledged food donations and will ensure listed items are accurately described.
            </label>
          </div>
        )}

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
