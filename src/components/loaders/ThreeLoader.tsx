import React, { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';
import BracketLoader from './BracketLoader';
import DotLoader from './DotLoader';

import classnames from './Loader.module.scss'
import { getMobilePlatform } from '~/utils';

interface ThreeLoaderProps {
  noPrep?: boolean;
  invert?: boolean;
}

const ThreeLoader: React.FC<ThreeLoaderProps> = ({
  noPrep = false,
  invert = false,
}) => {
  const { progress } = useProgress();

  const renderProgressMessage = (p: number) => (
    <>
      <div style={{ fontSize: '1.5rem', marginBottom: '.5rem' }}>
        <span style={{ whiteSpace: 'nowrap' }}>Experience Loading: {Math.round(p)}%</span>
      </div>
    </>
  );

  const [platform, setPlatform] = useState(() => ({
    isIOS: false,
    isAndroid: false,
    isIphone: false,
  }));
  
  useEffect(() => {
    setPlatform(getMobilePlatform());
  }, []);

  return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          backgroundColor: invert && platform.isIOS ? 'rgba(1, 1, 1, 1)' : invert ? 'rgba(1, 1, 1, .75)' : 'rgba(244, 244, 244, 1)',
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
        className={classnames['container']}
      >
        <BracketLoader invert={invert} isIOS={platform.isIOS}>
          {(progress === 0 && !noPrep)
        ? (<DotLoader/>)   
        : renderProgressMessage(progress)
          }
        </BracketLoader>
      </div>
    )
};

export default ThreeLoader;