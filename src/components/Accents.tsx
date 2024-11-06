import { forwardRef, ReactNode } from 'react';
import { Group } from 'three';
import { Instances } from '~/jsx-models/DigiviceMesh';

interface IAccents {
    amount?: number,
    scaleFactor?: number,
    children: ReactNode
}

const Accents = forwardRef<Group[], IAccents>(({
    amount = 10,
    scaleFactor = 1,
    children
}, ref: React.MutableRefObject<(Group | null)[]>) => {

    return (
        <Instances>
            {
                [...Array(amount)].map( (x,i) => (
                    <group
                        ref={(el) => {ref.current[i] = el}}
                        key={`model-${Math.random}-${i}`}
                        position={[
                            (Math.random() - 0.5) * 5,
                            (Math.random() - 0.5) * 5,
                            (Math.random() - 0.5) * 5
                        ]}
                        scale={(0.2 + Math.random() * 0.2) * scaleFactor}
                        rotation={[
                            Math.random() * Math.PI,
                            Math.random() * Math.PI,
                            Math.random() * Math.PI
                        ]}
                        dispose={null}
                    >
                        {children}
                    </group>
                    
                ))
            }
        </Instances>
    );
})
export default Accents;