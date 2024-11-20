import { Euler, Vector2, Vector3 } from "@react-three/fiber";
import { BlendFunction } from "postprocessing";
import { Mesh, Material } from "three";
import { GLTF } from "three-stdlib";

export interface GLTFResult extends GLTF {
    nodes: {
        [key: string]: Mesh
    }
    materials: {
        [key: string]: Material
    }
}

export interface ICloneProps {
    scale?: number,
    position?: Vector3,
    rotation?: Euler
}

export interface IWarpProps {
    warp?: number,
    intensity?: number,
    frequency?: number,
    scale?: number,
    blendFunction?: BlendFunction
}

export interface IWarpClassProps extends IWarpProps {
    resolution: Vector2,
}

export interface IMeshProps {
    scale?: number,
    position?: Vector3,
    rotation?: Vector3
}