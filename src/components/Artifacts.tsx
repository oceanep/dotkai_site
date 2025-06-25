import { FC, useLayoutEffect, useMemo, useRef } from "react";

import { useFrame, useThree } from "@react-three/fiber";

import { BoxGeometry } from "three/src/geometries/BoxGeometry";
import { MeshStandardMaterial } from "three/src/materials/MeshStandardMaterial";
import { Color } from "three/src/math/Color";
import { InstancedMesh } from 'three/src/objects/InstancedMesh';
import { Object3D } from 'three/src/core/Object3D';
import { Matrix4 } from 'three/src/math/Matrix4'
import { LineBasicMaterial } from "three/src/materials/LineBasicMaterial";
import { LineSegments } from "three/src/objects/LineSegments";
import { EdgesGeometry } from "three/src/geometries/EdgesGeometry";
import { InstancedBufferAttribute } from "three/src/core/InstancedBufferAttribute";
import { InstancedBufferGeometry } from "three/src/core/InstancedBufferGeometry";
import { Vector3 } from "three/src/math/Vector3";
import { Quaternion } from "three/src/math/Quaternion";


const Artifacts: FC = () => {

    const scene = useThree(state => state.scene);

    const squareInstRef = useRef<InstancedMesh | null>(null);
    const instancedLineGeomRef = useRef<InstancedBufferGeometry | null>(null);
    
    const dummy = useMemo(() => new Object3D(), []);
    const mat4 = useMemo(() => new Matrix4(), []);
    const animCounter = useRef(150);

    const rotationSpeedsRef = useRef<Float32Array>(
        Float32Array.from({ length: 150 }, () => 0.01 + Math.random() * 0.04)
    );

    const rotationAxesRef = useRef<Vector3[]>(
        Array.from({ length: 150 }, () =>
            //y axis of 1 to bring it above xz axis, can clamp x and z to bring the variation in
            new Vector3(Math.random(), 1, Math.random()).normalize()
        )
    );

    // create artifact meshes/instances manually and place them in scene
    useLayoutEffect(() => {
        // variable constants
        const color = 0.35;
        const amount = animCounter.current;

        // Initialize the geometry and material for the artifact
        const artifactGeometry = new BoxGeometry(2, 2, 2);
        const artifactMaterial = new MeshStandardMaterial({
            color: new Color(color, color, color),
            metalness: 0,
            roughness: 1,
            lightMapIntensity: 0,
            emissive: new Color(color, color, color),
            opacity: 0.5,
            emissiveIntensity: 0,
            polygonOffset: true,
            polygonOffsetFactor: 0.1,
        });

        // Create instanced mesh
        const squareInst = new InstancedMesh(artifactGeometry, artifactMaterial, amount);
        squareInstRef.current = squareInst; // <-- store ref

        // Control the range of instance dispersion
        const posClampPlus = 3;
        const posClampMinus = posClampPlus/2
        let pos = [];
        let rot = [];
        let scl = [];

        for(let x = 0; x < amount; x++){
            // Prefix number to pick an initial offset
            dummy.position.set(
                0 +(Math.random() * posClampPlus - posClampMinus),
                -0.25 + (Math.random() *posClampPlus - posClampMinus),
                -1 + (Math.random() * posClampPlus - posClampMinus),    
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
            squareInst.setMatrixAt(x, dummy.matrix);
            pos.push(dummy.position.x, dummy.position.y, dummy.position.z);
            rot.push(dummy.quaternion.x, dummy.quaternion.y, dummy.quaternion.z, dummy.quaternion.w);
            scl.push(dummy.scale.x, dummy.scale.y, dummy.scale.z);
        }
        // animCounter.current = counter;

        squareInst.instanceMatrix.needsUpdate = true
        scene.add(squareInst)

        const lineGeom = new EdgesGeometry(artifactGeometry);
        const instancedLineGeom = new InstancedBufferGeometry();
        instancedLineGeom.attributes = { ...lineGeom.attributes };
        instancedLineGeom.index = lineGeom.index;
        instancedLineGeom.instanceCount = Infinity;
        instancedLineGeom.setAttribute("instT", new InstancedBufferAttribute(new Float32Array(pos), 3));
        instancedLineGeom.setAttribute("instR", new InstancedBufferAttribute(new Float32Array(rot), 4));
        instancedLineGeom.setAttribute("instS", new InstancedBufferAttribute(new Float32Array(scl), 3));
        instancedLineGeomRef.current = instancedLineGeom; // <-- store ref
        let lineMat = new LineBasicMaterial({
            color: "white"
        });

        lineMat.onBeforeCompile = shader => {
            shader.vertexShader = `
            attribute vec3 instT;
            attribute vec4 instR;
            attribute vec3 instS;
            
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
        const lines = new LineSegments(instancedLineGeom, lineMat);
        scene.add(lines);

        //leanup function
        return () => {
            // 3. Dispose of resources
            squareInst.geometry.dispose();
            squareInst.material.dispose();

            lines.geometry.dispose();
            lines.material.dispose();
            scene.remove(squareInst);
            scene.remove(lines);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scene]);

    //mesh group animations
    useFrame((s, delta) => {
        
        const inst = squareInstRef.current;
        const geom = instancedLineGeomRef.current;

        if (!inst || !geom) return;

        for (let i = 0; i < animCounter.current; i++) {
            inst.getMatrixAt(i, mat4);
            mat4.decompose(dummy.position, dummy.quaternion, dummy.scale);

            //get world rotation and speed and set to quaternion
            const axis = rotationAxesRef.current[i];
            const speed = rotationSpeedsRef.current[i];
            const rotationQuat = new Quaternion().setFromAxisAngle(axis, delta * speed);
            
            //apply world rotation
            dummy.position.sub(new Vector3(0, 0, 0)); // translate to origin
            dummy.position.applyQuaternion(rotationQuat);  // rotate around origin
            dummy.position.add(new Vector3(0, 0, 0)); // translate back (noop here)
            
            //rotate around self
            dummy.rotation.x += delta * 0.5;
            dummy.rotation.z += delta * 0.2;
            
            //update matrices for instanced mesh
            dummy.updateMatrix();
            inst.setMatrixAt(i, dummy.matrix);

            //update matrices for geometry so line geometry updates
            geom.attributes.instT.setXYZ(i, dummy.position.x, dummy.position.y, dummy.position.z);
            geom.attributes.instR.setXYZW(i, dummy.quaternion.x, dummy.quaternion.y, dummy.quaternion.z, dummy.quaternion.w);
            geom.attributes.instS.setXYZ(i, dummy.scale.x, dummy.scale.y, dummy.scale.z);
        }

        inst.instanceMatrix.needsUpdate = true;
        geom.attributes.instT.needsUpdate = true;
        geom.attributes.instR.needsUpdate = true;
        geom.attributes.instS.needsUpdate = true;
    });

    return (
        <></>
    )
};

export default Artifacts;