import React, { useEffect } from 'react';
import { useProgress } from '@react-three/drei';
import BracketLoader from './BracketLoader';
import DotLoader from './DotLoader';

interface ThreeLoaderProps {
  setLoadingComplete: (s:boolean) => void;
  loadingComplete?: boolean;
  noBg?: boolean;
  noPrep?: boolean;
  invert?: boolean;
}

const ThreeLoader: React.FC<ThreeLoaderProps> = ({
  setLoadingComplete,
  loadingComplete = false,
  noBg = false,
  noPrep = false,
  invert = false,
}) => {
  const { progress } = useProgress();

  // useEffect(() => {
  //   if (progress === 100 && allowComplete) {
  //     console.log('setting complete true:', progress)
  //     setAllowComplete(false);
  //     setTimeout(() => {
  //       setLoadingComplete(true);
  //     }, 100);
  //   }
  // }, [progress, setLoadingComplete]);

  // useEffect(() => {
  //   if (progress === 0) {
  //     setAllowComplete(false);
  //   }
  // }, [progress]);

  const renderProgressMessage = (p: number) => (
    <>
      <div style={{ fontSize: '1.5rem', marginBottom: '.5rem' }}>
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
          backgroundColor: invert ? 'rgba(1, 1, 1, .75)' : 'rgba(244, 244, 244, 1)',
          color: invert ? 'rgba(244, 244, 244, 1)' : 'rgba(1, 1, 1, 1)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          zIndex: 10000000,
          opacity: progress === 100 ? 0 : 1,
          pointerEvents: progress === 100 ? 'none' : 'auto', // Prevent interaction when hidden
          transition: progress < 80 ? 'none' : 'opacity 0.5s ease-in-out', // Smooth animation
        }}
      >
        <BracketLoader invert={invert}>
          {(progress === 0 && !noPrep)
        ? (<DotLoader/>)   
        : renderProgressMessage(progress)
          }
        </BracketLoader>
      </div>
    )
};

export default ThreeLoader;