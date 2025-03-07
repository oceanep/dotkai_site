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
                dpr={ [1, 3] }
                gl={{
                antialias: false,
                toneMapping: ACESFilmicToneMapping,
                outputColorSpace: SRGBColorSpace
                }}
                camera={{
                fov: 45,
                near: 0.1,
                far: 100,
                position: [0, 0.5, 3.5],
                rotation: [0, 0, 0]
                }}
            >
                <Preload all />
                {children}
            </Canvas>
        </SceneContainer>
    );
};

export default CanvasWrapper;