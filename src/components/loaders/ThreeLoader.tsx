import React from 'react';
import { useProgress } from '@react-three/drei';
import BracketLoader from './BracketLoader';
import DotLoader from './DotLoader';

const ThreeLoader: React.FC = () => {
  const { progress } = useProgress();
  const renderProgressMessage = (p: number) => (
    <>
      <div style={{ fontSize: '1.5rem', color: 'black', marginBottom: '.5rem' }}>
        <span style={{ whiteSpace: 'nowrap' }}>Experience Loading: {Math.round(p)}%</span>
      </div>
    </>
  );
  return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(226, 226, 226, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          zIndex: 10000000,
          opacity: progress === 100 ? 0 : 1,
          transition: 'opacity 0.1s ease-in-out',
        }}
        >
        <BracketLoader>
          {progress === 0 
            ? (<DotLoader/>)   
            : renderProgressMessage(progress)
          }
        </BracketLoader>
        {/* <div
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
        </style> */}
      </div>
  );
};

export default ThreeLoader;