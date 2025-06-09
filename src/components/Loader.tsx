import React from 'react';
import { Html } from '@react-three/drei';

const Loader: React.FC = () => {

  return (
    <Html center>      
        <div
            style={{
            position: 'relative',
            width: '50px',
            height: '50px',
            backgroundColor: 'black',
            animation: 'moveBackAndForth 2s ease-in-out infinite',
            }}
        ></div>
        <style>
            {`
            @keyframes moveBackAndForth {
                0%, 100% {
                transform: translateX(0);
                }
                50% {
                transform: translateX(100px);
                }
            }
            `}
        </style>
    </Html>
  );
};

export default Loader;