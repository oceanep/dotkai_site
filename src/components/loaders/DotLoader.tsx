import React from 'react';

const dotsKeyframes = `
    @keyframes dots {
        0%, 20% {
            opacity: 0;
        }
        40% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }
`;

const DotLoader: React.FC = () => {
    return (
        <>
            <div
                style={{
                    fontSize: '1.5rem',
                    color: 'black',
                    // display: 'flex',
                    // alignItems: 'center',
                    // gap: '0.2rem',
                    // marginBottom: '.5rem',
                    whiteSpace: 'nowrap'
                }}
            >
                Preparing Modules
                <span style={{ animation: 'dots 1.5s infinite' }}>.</span>
                <span style={{ animation: 'dots 1.5s infinite 0.5s' }}>.</span>
                <span style={{ animation: 'dots 1.5s infinite 1s' }}>.</span>
            </div>
            <style>{dotsKeyframes}</style>
        </>
    );
};

export default DotLoader;