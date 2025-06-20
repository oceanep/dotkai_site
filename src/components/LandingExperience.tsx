import { FC, Suspense, useEffect, useLayoutEffect, useRef } from "react";
// import { CapsuleGeometry, Color, MeshStandardMaterial } from "three";
import {
    Environment,
    Lightformer,
    Bounds,
    Bvh,
    Instances,
    Instance
} from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { useControls } from "leva";

import Logo from '~/components/Logo'
import { useFrame, useThree } from "@react-three/fiber";
import Accents from "./Accents";
// import { DigiviceMesh } from "~/jsx-models/DigiviceMesh";
import Parallax from "./Parallax";
import { BoxGeometry } from "three/src/geometries/BoxGeometry";
import { MeshStandardMaterial } from "three/src/materials/MeshStandardMaterial";
import { Color } from "three/src/math/Color";
import { InstancedMesh } from 'three/src/objects/InstancedMesh';
import { Object3D } from 'three/src/core/Object3D';
import { Matrix4 } from 'three/src/math/Matrix4'
import { LineBasicMaterial } from "three/src/materials/LineBasicMaterial";
import { LineSegments } from "three/src/objects/LineSegments";
import { EdgesGeometry } from "three/src/geometries/EdgesGeometry";
import { Vector3 } from "three/src/math/Vector3";
import { InstancedBufferAttribute, InstancedBufferGeometry } from "three";

const capsuleGeometry = new BoxGeometry(2, 2, 2);
const capsuleMaterial = new MeshStandardMaterial();

const instanceData = Array.from({ length: 100 }, (_, i) => ({
    position: [
        Math.random() * 5 - 2.5,
        Math.random() * 5 - 2.5,
        Math.random() * 5 - 2.5
    ] as [number, number, number],
    scale: [
        (0.2 + Math.random() * 0.2) * Math.pow(10, -1.4),
        (0.2 + Math.random() * 0.2) * Math.pow(10, -1.4),
        (0.2 + Math.random() * 0.2) * Math.pow(10, -1.4)
    ]
}));

// Create edges geometry from capsuleGeometry
// const edges = new EdgesGeometry(capsuleGeometry);
// const lineMaterial = new LineBasicMaterial({ color: 0xffffff });
// const lineSegments = new LineSegments(edges, lineMaterial);
// const edgeGeometry = new EdgesGeometry(capsuleGeometry);
// const edgeMaterial = new LineBasicMaterial({
//     color: 0xffff00
// });
// const edgeInstances = new InstancedBufferGeometry();



// var instLines = new LineSegments(edgeInstances, edgeMaterial);

// // Apply a slight outward scaling to the edges
// const scaleMatrix = new Matrix4().makeScale(1.01, 1.01, 1.01);
// edgeInstances.geometry.applyMatrix4(scaleMatrix);

const LandingExperience: FC = () => {

    //update capsule material
    useEffect(() => {
        const color = 0.35
        capsuleMaterial.metalness = 0;
        capsuleMaterial.roughness = 1;
        capsuleMaterial.color = new Color(color, color, color);
        capsuleMaterial.lightMapIntensity = 0;
        capsuleMaterial.emissive = new Color(color, color, color);
        capsuleMaterial.opacity = 0.5;
        capsuleMaterial.emissiveIntensity = 0;
        capsuleMaterial.polygonOffset = true;
        capsuleMaterial.polygonOffsetFactor = 0.1;
        capsuleMaterial.needsUpdate = true;

        const squareInst = new InstancedMesh(capsuleGeometry, capsuleMaterial, 150)

        let dummy = new Object3D();
        let mat4 = new Matrix4();
        let counter = 0;
        const posClampPlus = 2;
        const posClampMinus = posClampPlus/2
        let pos = [];
        let rot = [];
        let scl = [];

          for(let x = 0; x < 150; x++){
            dummy.position.set(
                0 +(Math.random() * posClampPlus - posClampMinus),
                -0.25 + (Math.random() *posClampPlus - posClampMinus),
                -0.5 + (Math.random() * posClampPlus - posClampMinus),    
            ).multiplyScalar(4);
            dummy.rotation.set(
              Math.random() * Math.PI * 2,
              Math.random() * Math.PI * 2,
              Math.random() * Math.PI * 2
            );
            dummy.scale.set(
                (0.5 + Math.random() * 0.2) * Math.pow(10, -1.4),
                (0.5 + Math.random() * 0.2) * Math.pow(10, -1.4),
                (0.5 + Math.random() * 0.2) * Math.pow(10, -1.4)
            );
            dummy.updateMatrix();
            squareInst.setMatrixAt(counter, dummy.matrix);
            pos.push(dummy.position.x, dummy.position.y, dummy.position.z);
            rot.push(dummy.quaternion.x, dummy.quaternion.y, dummy.quaternion.z, dummy.quaternion.w);
            scl.push(dummy.scale.x, dummy.scale.y, dummy.scale.z);
            counter++;
          }

        squareInst.instanceMatrix.needsUpdate = true
        scene.add(squareInst)

        const lineGeom = new EdgesGeometry(capsuleGeometry);
        const instancedLineGeom = new InstancedBufferGeometry();
        instancedLineGeom.attributes = { ...lineGeom.attributes };
        instancedLineGeom.index = lineGeom.index;
        instancedLineGeom.instanceCount = Infinity;
        instancedLineGeom.setAttribute("instT", new InstancedBufferAttribute(new Float32Array(pos), 3));
        instancedLineGeom.setAttribute("instR", new InstancedBufferAttribute(new Float32Array(rot), 4));
        instancedLineGeom.setAttribute("instS", new InstancedBufferAttribute(new Float32Array(scl), 3));
        let lineMat = new LineBasicMaterial({
            color: "white"
        });

        lineMat.onBeforeCompile = shader => {
            shader.vertexShader = `
            attribute vec3 instT;
            attribute vec4 instR;
            attribute vec3 instS;
            
            // http://barradeau.com/blog/?p=1109
            vec3 trs( inout vec3 position, vec3 T, vec4 R, vec3 S ) {
                position *= S;
                position += 2.0 * cross( R.xyz, cross( R.xyz, position ) + R.w * position );
                position += T;
                return position;
            }
            ${shader.vertexShader}
        `.replace(
            `#include <begin_vertex>`,
            `#include <begin_vertex>
            transformed = trs(transformed, instT, instR, instS);
        `
            );
        };
        let lines = new LineSegments(instancedLineGeom, lineMat);
        scene.add(lines);
    }, []);

    //Artifact mesh group refs
    const artifactRef = useRef<InstancedMesh | null>(null);

    // useLayoutEffect(() => {
    //     artifactRef.current?.setMatrixAt(0, new Matrix4());
    // }, [])



    //mesh group animations
    // useFrame((s, delta) => {
    //     let i = 1;
    //     if (digiviceRef.current && digiviceRef.current.length > 0) {
    //         for (const digivice of digiviceRef.current) {
    //             const t = s.clock.getElapsedTime() + 2 * 10000
    //             digivice.rotation.y += delta * 1.2
    //             digivice.rotation.z += delta * 1.4
    //             digivice.position.x = Math.cos(t / 4.5) / 2 + i / 5 - 10
    //             i++;
    //         }
    //     }
    //     if (capsuleRef.current && capsuleRef.current.length > 0 ) {
    //         for (const capsule of capsuleRef.current) {
    //             capsule.rotation.y += delta * 5.7;
    //             capsule.rotation.z += delta * 3.2;
    //         }
    //     }
    // });

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

    // useLayoutEffect(() => {
    //     edgeMaterial.onBeforeCompile = shader => {
    //         shader.vertexShader = `
    //         attribute vec3 offsetPosition;
    //         attribute vec3 offsetScale;
    //         varying vec3 vScale;
    //         ${shader.vertexShader}
    //         `.replace(
    //             `#include <begin_vertex>`,
    //         `
    //         #include <begin_vertex>
    //         vScale = offsetScale;
    //         transformed += offsetPosition * offsetScale;
    //         `
    //         );
    //         shader.fragmentShader = `
    //         varying vec3 vScale;
    //         ${shader.fragmentShader}
    //         `;
    //     };
    //     edgeInstances.attributes = { ...edgeGeometry.attributes };
    //     edgeInstances.index = edgeGeometry.index;

    //     const offsetPosition = [];
    //     const offsetScale = [];
    //     instanceData.forEach(({ position, scale }) => {
    //         offsetPosition.push(...position);
    //         offsetScale.push(...scale);
    //     });
    //     edgeInstances.setAttribute("offsetPosition", new InstancedBufferAttribute(new Float32Array(offsetPosition), 3));
    //     edgeInstances.setAttribute("offsetScale", new InstancedBufferAttribute(new Float32Array(offsetScale), 3));
    //     edgeInstances.instanceCount = instanceData.length;

    //     const instLines = new LineSegments(edgeInstances, edgeMaterial);
    //     scene.add(instLines);
    // }, [instanceData]);

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
            <Suspense fallback={null}>
                <Bounds fit clip observe margin={0.9}>
                    <Logo />
                </Bounds>
            </Suspense>
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
            <Suspense fallback={null}>
                {/* <Instances
                    args={[capsuleGeometry, capsuleMaterial, 75]} // Ensure geometry and material are passed correctly
                    ref={artifactRef}
                >
                    {instanceData.map((data, index) => (
                        <Instance
                            key={index}
                            position={data.position as [number, number, number]}
                            scale={data.scale as [number, number, number]}
                        />
                    ))}
                </Instances> */}
            </Suspense>
        </Bvh>
    )
};

export default LandingExperience;