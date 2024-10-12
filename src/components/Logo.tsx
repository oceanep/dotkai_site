"use client";

import { FC, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Group, Mesh } from "three";
import { Html, PivotControls } from "@react-three/drei";
import { Inner3dPill } from "~/styles/styled";

const LogoMesh:FC = () => {
    const fileUrl = "/Models/Logo Model/ocean_logo.gltf";
    const group = useRef<Group>(null!);
    const logoRef = useRef<Mesh>(null!);
    const boxRef = useRef<Mesh>(null!);
    const gltf = useLoader(GLTFLoader, fileUrl);
    console.log('checking gltf: ', gltf)

    useFrame((state, delta) => {
        group.current.rotation.y += delta;
    });

    return (
        <group ref={group}>
            <mesh ref={logoRef}>
                <primitive object={gltf.scene}/> 
            </mesh>
            <PivotControls
                depthTest={false}
                lineWidth={4}
                axisColors={[ '#9381ff', '#ff4d6d', '#7ae582' ]}
                scale={100}
                fixed={true}
            >
                <mesh ref={boxRef} position-y={0.5} position-z={-0.2} scale={0.75}>
                    <boxGeometry args={[4,2,0,9,9,0]}/>
                    <meshBasicMaterial color={'#000'} wireframe />
                    <Html
                        position={[0.5,0.5,0.5]}
                        center
                        distanceFactor={4}
                        occlude={[boxRef]}
                    >
                        <Inner3dPill>This is a pill</Inner3dPill>
                    </Html>
                </mesh>
            </PivotControls>
            {/* <TransformControls object={boxRef} /> */}
        </group>
    );
}

export default LogoMesh;