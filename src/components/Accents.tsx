import { FC } from 'react';
import { useGLTF, Clone } from '@react-three/drei'
import { ICloneProps, IMeshProps } from '~/utils/types';
import { DigiviceMesh, Instances } from '~/jsx-models/DigiviceMesh';

const Accents:FC<ICloneProps> = (props) => {
    const fileUrl = "/models/digivice.glb";
    const model = useGLTF(fileUrl);
    
    return (
        <Instances>
            {
                [...Array(100)].map( (x,i) => (
                    <DigiviceMesh
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
                    />
                    
                ))
            }
        </Instances>
    );
}
useGLTF.preload("/models/digivice.glb");

export default Accents;