
import React from 'react';

interface LogoProps {
    width?: string;
    height?: string;
}

const Logo: React.FC<LogoProps> = ({ width = '50px', height = '50px' }) => (
    <img src="images/logo-trust.png" alt="Logo" width={width} height={height} />
);

export default Logo;
