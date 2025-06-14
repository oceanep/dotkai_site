import React from 'react';
import { useProgress } from '@react-three/drei';

const ThreeLoader: React.FC = () => {
  const { progress } = useProgress();
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
        {progress === 0 ? (
          <>
            <div style={{ fontSize: '1.5rem', color: 'black', display: 'flex', alignItems: 'center', gap: '0.2rem', marginBottom: '.5rem' }}>
              Preparing Modules
              <span style={{ animation: 'dots 1.5s infinite' }}>.</span>
              <span style={{ animation: 'dots 1.5s infinite 0.5s' }}>.</span>
              <span style={{ animation: 'dots 1.5s infinite 1s' }}>.</span>
            </div>
              <style>
                {`
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
                `}
              </style>
          </>
        ) :
          <>
            <div style={{ fontSize: '1.5rem', color: 'black', marginBottom: '.5rem' }}>Experience Loading: {Math.round(progress)}%</div>
          </>
        }
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
  );
};

export default ThreeLoader;