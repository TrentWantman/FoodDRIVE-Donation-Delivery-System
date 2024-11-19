import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../FoodDRIVE logo.png';

const Logo = () => {
    return (
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <Link to="/login">
                <img src={logo} alt="FoodDRIVE Logo" style={{ width: '300px' }} />
            </Link>
        </div>
    );
};

export default Logo;
