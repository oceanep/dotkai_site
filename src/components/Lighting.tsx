import { FC, useRef } from "react";
import {
    Environment,
    Lightformer,
} from '@react-three/drei'


const Lighting: FC = () => {

    //Light Visual Helper
    const directionalLight = useRef();

    return (
        <>
            <color args={[ "#ffffff" ]} attach="background" />
            <Environment
                environmentIntensity={1}
            >
                <Lightformer
                    position={[0, 0, -3]}
                    scale={5}
                    color={'#ffe5e5'}
                    intensity={10}
                    form="ring"
                />
            </Environment>
            <directionalLight
                ref={directionalLight}
                position={[1, 2, 3]}
                intensity={3.5}
                castShadow
                shadow-mapSize={[1024, 1024]}
                shadow-normalBias={0.04}
            />
        </>
    )
};

export default Lighting;