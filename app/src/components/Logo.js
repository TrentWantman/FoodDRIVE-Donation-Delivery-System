import React from 'react';
import logo from '../FoodDRIVE logo.png';

const Logo = () => {
    return (
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <img src={logo} alt="FoodDRIVE Logo" style={{ width: '300px' }} />
        </div>
    );
};

export default Logo;