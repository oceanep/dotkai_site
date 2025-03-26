import { Preload } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { ACESFilmicToneMapping, SRGBColorSpace } from "three";
import { SceneContainer } from "~/styles/styled";

const CanvasWrapper = ({ children }) => {
    return (
        <SceneContainer>
            <Leva
                collapsed
            />
            <Canvas
                shadows
                dpr={ [1, 2] }
                gl={{
                    antialias: false,
                    toneMapping: ACESFilmicToneMapping,
                    outputColorSpace: SRGBColorSpace
                }}
                //position for landing had y of 0.5, adjust landing position later
                camera={{
                    fov: 45,
                    near: 0.1,
                    far: 100,
                    position: [0, 0, 3.5],
                    rotation: [0, 0, 0]
                }}
                eventSource={document.getElementById('root')}
                eventPrefix="client"
            >
                <Preload all />
                {children}
            </Canvas>
        </SceneContainer>
    );
};

export default CanvasWrapper;