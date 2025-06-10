import { FC, useEffect, useRef } from "react";
import { CapsuleGeometry, Color, MeshStandardMaterial } from "three";
import {
    Environment,
    Lightformer,
    Bounds,
    Bvh
} from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { useControls } from "leva";

import Logo from '~/components/Logo'
import { useFrame, useThree } from "@react-three/fiber";
import Accents from "./Accents";
// import { DigiviceMesh } from "~/jsx-models/DigiviceMesh";
import Parallax from "./Parallax";

const capsuleGeometry = new CapsuleGeometry(1, 1, 4, 8);
const capsuleMaterial = new MeshStandardMaterial();

const LandingExperience: FC = () => {

    //update capsule material
    useEffect(() => {
        capsuleMaterial.metalness = 0.9
        capsuleMaterial.roughness = 0.05
        capsuleMaterial.color = new Color(0.3, 0.3, 0.3)
        capsuleMaterial.emissive = new Color(0.3, 0.3, 0.3)
        capsuleMaterial.emissiveIntensity = 2
        capsuleMaterial.needsUpdate = true
    }, []);

    //Accent mesh group refs
    const digiviceRef = useRef([]);
    const capsuleRef = useRef([]);

    //mesh group animations
    useFrame((s, delta) => {
        let i = 1;
        if (digiviceRef.current && digiviceRef.current.length > 0) {
            for (const digivice of digiviceRef.current) {
                const t = s.clock.getElapsedTime() + 2 * 10000
                digivice.rotation.y += delta * 1.2
                digivice.rotation.z += delta * 1.4
                digivice.position.x = Math.cos(t / 4.5) / 2 + i / 5 - 10
                i++;
            }
        }
        if (capsuleRef.current && capsuleRef.current.length > 0 ) {
            for (const capsule of capsuleRef.current) {
                capsule.rotation.y += delta * 5.7;
                capsule.rotation.z += delta * 3.2;
            }
        }
    });

    //Light Visual Helper
    const directionalLight = useRef();
    
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
        envColor: "#ffe5e5",
        backgroundColor: "#ffffff"
    });

    //Scene Settings
    const scene = useThree(state => state.scene);


    useEffect(() => {
        scene.environmentIntensity = envMapIntensity;
        scene.background = new Color(backgroundColor);
    }, [envMapIntensity, backgroundColor, scene]);

    return (
        <Bvh>
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
                // files="/environmentMaps/beautiful_sunrise_at_coast_2k.hdr"
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
            <directionalLight
                ref={directionalLight}
                position={sunPosition}
                intensity={3.5}
                castShadow
                shadow-mapSize={[1024, 1024]}
                shadow-normalBias={0.04}
            />
            <Bounds fit clip observe margin={0.9}>
                <Logo />
            </Bounds>
            <Parallax/>
            {/* <Accents
                amount={75}
                scaleFactor={Math.pow(10, -1.4)}
                ref={digiviceRef}
            >
                <mesh
                    receiveShadow
                    geometry={capsuleGeometry}
                    material={capsuleMaterial}
                />
            </Accents> */}
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
        </Bvh>
    )
};

export default LandingExperience;