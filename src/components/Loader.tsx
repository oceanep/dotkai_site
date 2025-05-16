import React from 'react';
import { Html, useProgress } from '@react-three/drei';

const Loader: React.FC = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{ fontSize: '2rem', color: 'white' }}>{Math.round(progress)}%</div>
    </Html>
  );
};

export default Loader;