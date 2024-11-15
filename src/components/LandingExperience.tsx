import { FC, Suspense, useEffect, useRef, useState } from "react";
import { 
    DragControls, 
    Float, 
    useHelper, 
    BakeShadows,
    SoftShadows,
    AccumulativeShadows,
    RandomizedLight,
    ContactShadows,
    Sky,
    Environment,
    Lightformer
} from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { useControls } from "leva";
import { DirectionalLightHelper, Vector3 } from "three";


import Floor from '~/components/Floor'
import LogoMesh from '~/components/Logo'
import Controls from '~/components/Controls'
import CustomObject from "./CustomObject";
import { useThree } from "@react-three/fiber";
import Fallback from "./Fallback";

const LandingExperience:FC = () => {
    
    const [orbActive, setOrbActive] = useState<boolean>(true);

    //Light Visual Helper
    const directionalLight = useRef();
    useHelper(directionalLight, DirectionalLightHelper, 1);

    // Leva Controls
    const { perfVisible } = useControls({
        perfVisible: true
    });

    const { size, samples, focus } = useControls("soft shadows", {
        size: {
            value: 4.5,
            min: 0,
            max: 50,
        },
        samples: {
            value: 15,
            min: 0,
            max: 50,
        },
        focus: {
            value: 0,
            min: 0,
            max: 10,
        }
    });

    const { sunPosition } = useControls("sky", {
        sunPosition: {
            value: [1,2,3]
        }
    });

    // const { color, opacity, blur, scale, far, near } = useControls("contact shadows", {
    //     color: '#000000',
    //     opacity: {
    //         value: 0.5, min: 0, max: 1
    //     },
    //     blur: {
    //         value: 1, min: 0, max: 10
    //     },
    //     scale: {
    //         value: 10, min: 0, max: 15
    //     },
    //     far: {
    //         value: 3, min: 0, max: 50
    //     },
    //     near: {
    //         value: 0, min: -50, max: 0
    //     }
    // });

    const { 
        envMapIntensity, 
        envMapHeight, 
        envMapRadius, 
        envMapScale, 
        envColor, 
        backgroundColor 
    } = useControls("environment map", {
        envMapIntensity: {
            value: 1,
            min: 0,
            max: 10
        },
        envMapHeight: {
            value: 7,
            min: 0,
            max: 100
        },
        envMapRadius: {
            value: 28,
            min: 10,
            max: 1000
        },
        envMapScale: {
            value: 100,
            min: 10,
            max: 1000
        },
        envColor: "red",
        backgroundColor: "#fedbfd"
    });

    //Scene Settings
    const scene = useThree(state => state.scene);

    useEffect(() => {
        scene.environmentIntensity = envMapIntensity;
    }, [ envMapIntensity ]);

    return (
        <>
            { perfVisible && <Perf position="top-left" /> }
            <color args={[ backgroundColor ]} attach="background" />
            <Environment
                // background
                //add 1 to all y positions to use
                // ground={{
                //     height: envMapHeight,
                //     radius: envMapRadius,
                //     scale: envMapScale
                // }}
                files="/environmentMaps/beautiful_sunrise_at_coast_2k.hdr"
                // resolution={32}
            >
                <Lightformer
                    position={[0,0,-3]}
                    scale={5}
                    color={envColor}
                    intensity={10}
                    form="ring"
                />
            </Environment>
            <SoftShadows
                size={size}
                samples={samples}
                focus={focus} 
            /> 
            {/* <ambientLight color={"white"} intensity={0.3} /> */}
            <directionalLight
                ref={ directionalLight }
                position={sunPosition}
                intensity={2.5}
                castShadow
                shadow-mapSize={[1024,1024]}
                />
            {/* <Sky sunPosition={sunPosition} /> */}
            {/* <BakeShadows />  */}
            {/*Use one of the below prerendered shadows if no lights*/}
            {/* <ContactShadows
                position={[0, -0.94, 0]}
                resolution={512}
                scale={scale}
                far={far}
                near={near}
                color={color}
                opacity={opacity}
                blur={blur}
            /> */}
            {/* <AccumulativeShadows
                position={[0, -0.94, 0]}
                scale={3}
                color="#2a000a"
                opacity={0.8}
                frames={Infinity}
                temporal
                blend={100}
            >
                <RandomizedLight 
                    amount={8}
                    radius={1}
                    ambient={0.5}
                    intensity={3}
                    position={[1,2,3]}
                    bias={0.001}
                />
            </AccumulativeShadows> */}
            {/* <DragControls
                onDragStart={() => setOrbActive(false)}
                onDragEnd={() => setOrbActive(true)}
            > */}
                <Suspense 
                    fallback={
                        <Fallback 
                            fontSize={.5} 
                            color="#9ce928" 
                            position={new Vector3( 0.5, 0.5, 0)} 
                        />
                    }>
                    <LogoMesh />
                </Suspense>
            {/* </DragControls> */}
            <Controls active={orbActive} />
            <Floor position={[0, -1, 0]}/>
        </>
    )
};

export default LandingExperience;