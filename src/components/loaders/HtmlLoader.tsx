import React from 'react';

const HtmlLoader: React.FC = () => {
  return (
    <div
        style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        zIndex: 10000000,
        transition: 'opacity 1s ease-in-out',
        }}
    >
        <div style={{ fontSize: '1.5rem', color: 'black', marginBottom: '1rem' }}>Experience Loading:</div>
        <div style={{ fontSize: '2rem', color: 'black' }}>0%</div>
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
                    transform: translateX(-50px);
                    }
                    50% {
                    transform: translateX(50px);
                    }
                }
                `}
        </style>
    </div>
  )
};

export default HtmlLoader;