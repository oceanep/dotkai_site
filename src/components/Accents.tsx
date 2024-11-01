import { FC } from 'react';
import { useGLTF, Clone } from '@react-three/drei'
import { ICloneProps, IMeshProps } from '~/utils/types';

const Accents:FC<ICloneProps> = (props) => {
    const fileUrl = "/models/digivice.glb";
    const model = useGLTF(fileUrl);
    
    return (
        <>
            {
                [...Array(100)].map( (x,i) => (
                    <mesh
                        key={`model-${Math.random}-${i}`}
                        position={[
                            (Math.random() - 0.5) * 5,
                            (Math.random() - 0.5) * 5,
                            (Math.random() - 0.5) * 5
                        ]}
                        scale={ 0.2 + Math.random() * 0.4 }
                        rotation={[
                            Math.random() * Math.PI,
                            Math.random() * Math.PI,
                            0
                        ]}
                    >
                        <Clone object={model.scene} {...props} />
                    </mesh>
                    
                ))
            }
        </>
    );
}
useGLTF.preload("/models/digivice.glb");

export default Accents;