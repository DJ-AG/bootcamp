import React from 'react';
import logo from '../assets/logo.svg';

function Logo() {
    return (
        <div className="text-center text-white p-6">
            <img src={logo} alt='logo'/>
        </div>
    );
}

export default Logo;