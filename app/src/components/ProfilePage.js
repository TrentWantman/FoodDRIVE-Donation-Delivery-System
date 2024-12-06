import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';  // Import the CSS file for styles

const ProfilePage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch current user information
        axios.get('http://localhost:5000/api/auth/user', { withCredentials: true })
            .then(response => {
                setUsername(response.data.username);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (newPassword !== confirmPassword) {
            setErrorMessage('Passwords do not match!');
            return;
        }

        try {
            const response = await axios.put(
                'http://localhost:5000/api/auth/user',
                {
                    username: username,
                    password: newPassword, // Send the new password here
                },
                { withCredentials: true }
            );
            console.log(response.data);
            alert('Profile updated successfully');
        } catch (error) {
            console.error('Error updating user:', error);
            setErrorMessage('Error updating user information');
        }
    };

    const handleLogout = () => {
        // Handle logout logic
        axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true })
            .then(() => {
                navigate('/login');
            })
            .catch(error => {
                console.error('Logout error:', error);
            });
    };

    return (
        <div className="form-container">
            <h2>Profile Page</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="input-field"  // Apply the CSS class here
                    />
                </div>

                <div>
                    <label>New Password:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="input-field"  // Apply the CSS class here
                    />
                </div>

                <div>
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="input-field"  // Apply the CSS class here
                    />
                </div>

                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

                <div>
                    <button type="submit" className="btn">Update Profile</button>
                </div>
            </form>

            <div>
                <button onClick={handleLogout} className="btn">Logout</button>
            </div>
        </div>
    );
};

export default ProfilePage;
