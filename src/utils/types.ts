import { Euler, Vector3 } from "@react-three/fiber";
import { Mesh, Material } from "three";
import { GLTF } from "three-stdlib";

export interface IMeshProps {
    scale?: number,
    position?: Vector3,
    rotation?: Vector3
}

export interface ICloneProps {
    scale?: number,
    position?: Vector3,
    rotation?: Euler
}

export interface GLTFResult extends GLTF {
    nodes: {
        [key: string]: Mesh
    }
    materials: {
        [key: string]: Material
    }
}