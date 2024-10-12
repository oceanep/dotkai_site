import { FC } from "react";
import { Text, DragControls, Float } from '@react-three/drei'
import { Suspense, useState } from 'react'

import Floor from '~/components/Floor'
import LogoMesh from '~/components/Logo'
import Controls from '~/components/Controls'
import CustomObject from "./CustomObject";
import { useFrame } from "@react-three/fiber";

const LandingExperience:FC = () => {
    
    const [orbActive, setOrbActive] = useState<boolean>(true);

    return (
        <>
            <color args={[ '#fedbfd' ]} attach="background" />
            <ambientLight color={"white"} intensity={0.3} />
            <directionalLight
                position={[1, 2, 3]}
                intensity={2.5}
            />
            {/* <DragControls
                onDragStart={() => setOrbActive(false)}
                onDragEnd={() => setOrbActive(true)}
            > */}
                <Suspense fallback={'...loading'}>
                    {/* <Box rotateX={3} rotateY={0.2} /> */}
                    <LogoMesh />
                    <Float
                        speed={5}
                        floatIntensity={2}
                    >
                        <Text
                            font="./fonts/mofuji04.ttf"
                            fontSize={.5}
                            color="#9ce928"
                            position-y={-0.5}
                            maxWidth={2}
                            textAlign="center"
                        >
                            LOADING...
                        </Text>
                    </Float>
                    {/* <CustomObject/> */}
                </Suspense>
            {/* </DragControls> */}
            <Controls active={orbActive} />
            <Floor position={[0, -1, 0]}/>
        </>
    )
};

export default LandingExperience;