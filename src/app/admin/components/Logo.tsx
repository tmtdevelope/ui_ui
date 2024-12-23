/* import { styled } from '@mui/system';

const Logo = styled('img')({
    height: '40px',
    marginRight: '16px',
});

export default Logo;

 */

import React from 'react';

interface LogoProps {
    width?: string;
    height?: string;
}

const Logo: React.FC<LogoProps> = ({ width = '50px', height = '50px' }) => (
    <img src="/path/to/logo.png" alt="Logo" width={width} height={height} />
);

export default Logo;
