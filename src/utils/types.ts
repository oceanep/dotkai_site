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

export enum EMediaType {
    SMARTPHONE = '(min-width: 375px) and (max-width: 812px)',
    TABLET = '(min-width: 768px) and (max-width: 1024px)',
    DESKTOP = '(min-width: 1024px) and (max-width: 1440px)',
    LARGE_DESKTOP = '(min-width: 1440px) and (max-width: 2560px)',
    WIDESCREEN = '(min-width: 2560px)',
}