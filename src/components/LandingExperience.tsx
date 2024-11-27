"use client"

import { FC, Suspense, useEffect, useRef, useState } from "react";
import { CapsuleGeometry, Color, DirectionalLightHelper, MathUtils, MeshStandardMaterial, Vector2, Vector3 } from "three";
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
    Lightformer,
    PerspectiveCamera,
    CameraControls,
    Bounds
} from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { useControls } from "leva";

import Floor from '~/components/Floor'
import Logo from '~/components/Logo'
import Controls from '~/components/Controls'
import { useFrame, useThree } from "@react-three/fiber";
import Fallback from "./Fallback";
import ComputerMesh from "./ComputerMesh";
import Accents from "./Accents";
import { DigiviceMesh } from "~/jsx-models/DigiviceMesh";
import EffectPass from "./EffectPass";
import Parallax from "./Parallax";

const capsuleGeometry = new CapsuleGeometry(1, 1, 4, 8);
const capsuleMaterial = new MeshStandardMaterial();

const LandingExperience: FC = () => {

    const [orbActive, setOrbActive] = useState<boolean>(true);

    //update capsule material
    useEffect(() => {
        capsuleMaterial.metalness = 0.9
        capsuleMaterial.roughness = 0.05
        capsuleMaterial.color = new Color(0.34, 1, 0.05)
        capsuleMaterial.emissive = new Color(0.34, 1, 0.05)
        capsuleMaterial.emissiveIntensity = 2
        capsuleMaterial.needsUpdate = true
    }, []);

    //Accent mesh group refs
    const digiviceRef = useRef([]);
    const capsuleRef = useRef([]);
    const warpRef = useRef(null);

    //mesh group animations
    useFrame((s, delta) => {
        let i = 1;
        for (const digivice of digiviceRef.current) {
            const t = s.clock.getElapsedTime() + 2 * 10000
            digivice.rotation.y += delta * 1.2
            digivice.rotation.z += delta * 1.4
            digivice.position.x = Math.cos(t / 4.5) / 2 + i / 5 - 10
            i++;
        }
        for (const capsule of capsuleRef.current) {
            capsule.rotation.y += delta * 5.7;
            capsule.rotation.z += delta * 3.2;
        }
    });

    //Light Visual Helper
    const directionalLight = useRef();
    useHelper(directionalLight, DirectionalLightHelper, 1);
    
    const { perfVisible, pillColor } = useControls({
        perfVisible: true,
        pillColor: "#3dff0d"
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
            value: [1, 2, 3]
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
        envColor: "#0087d8",
        backgroundColor: "#dffaff"
    });

    //Scene Settings
    const scene = useThree(state => state.scene);


    useEffect(() => {
        scene.environmentIntensity = envMapIntensity;
        scene.background = new Color(backgroundColor);
    }, [envMapIntensity, backgroundColor]);

    return (
        <>
            {perfVisible && <Perf position="top-left" />}
            {/* <color args={[ backgroundColor ]} attach="background" /> */}
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
                    position={[0, 0, -3]}
                    scale={5}
                    color={envColor}
                    intensity={10}
                    form="ring"
                />
            </Environment>
            {/* <SoftShadows
                size={size}
                samples={samples}
                focus={focus}
            /> */}
            {/* <ambientLight color={"white"} intensity={0.3} /> */}
            <directionalLight
                ref={directionalLight}
                position={sunPosition}
                intensity={3.5}
                castShadow
                shadow-mapSize={[1024, 1024]}
                shadow-normalBias={0.04}
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
            <EffectPass />
            {/* <DragControls
                onDragStart={() => setOrbActive(false)}
                onDragEnd={() => setOrbActive(true)}
            > */}
            <Suspense
                fallback={
                    <Fallback
                        fontSize={.5}
                        color="#9ce928"
                        position={[0.5, 0.5, 0]}
                    />
                }>
                <Bounds fit clip observe margin={0.9}>
                    <Logo />
                </Bounds>
                {/* <ComputerMesh
                    scale={0.2}
                    position={[0, -0.94, 0]}
                    rotation={[0, 0.75, 0]}
                /> */}
                <Parallax/>
                <Accents
                    amount={75}
                    scaleFactor={Math.pow(10, -3.2)}
                    ref={digiviceRef}
                >
                    <DigiviceMesh />
                </Accents>
                <Accents
                    amount={75}
                    scaleFactor={Math.pow(10, -1.4)}
                    ref={capsuleRef}
                >
                    <mesh
                        receiveShadow
                        geometry={capsuleGeometry}
                        material={capsuleMaterial}
                    />
                </Accents>
            </Suspense>
            {/* </DragControls> */}
            {/* <Controls active={orbActive} /> */}
            {/* <Floor position={[0, -1, 0]} /> */}
        </>
    )
};

export default LandingExperience;