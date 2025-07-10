import { Euler, Vector2, Vector3 } from "@react-three/fiber";
import { BlendFunction } from "postprocessing";
// import { Mesh, Material } from "three";
import { GLTF } from "three-stdlib";
import { Material } from "three/src/materials/Material";
import { Mesh } from "three/src/objects/Mesh";

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
    vignetteIntensity?: number,
    noiseIntensity?: number,
}

export interface IWarpClassProps extends IWarpProps {
    resolution: Vector2,
}

export interface INoiseProps {
    intensity: number;
    speed?: number;
    blendFunction?: BlendFunction
}

export interface INoiseClassProps extends INoiseProps {
    resolution: Vector2,
}

export interface IMeshProps {
    scale?: number,
    position?: Vector3,
    rotation?: Vector3
}

export interface ISideMenuItem {
    id: string,
    icon: string,
    label: string
}

export interface IListItem {
    title?: string,
    url?: string,
}

export enum EMediaType {
    SMARTPHONE = '(min-width: 375px) and (max-width: 812px)',
    TABLET = '(min-width: 768px) and (max-width: 1024px)',
    DESKTOP = '(min-width: 1024px) and (max-width: 1440px)',
    LARGE_DESKTOP = '(min-width: 1440px) and (max-width: 2560px)',
    WIDESCREEN = '(min-width: 2560px)',
}

export enum ESideMenuItem {
    ABOUT = 'about',
    CONTACT = 'contact',
}

export interface SharedPageProps {
    draftMode: boolean
    token: string
  }

export interface IVignetteProps {
    intensity?: number;
    blendFunction?: BlendFunction;
}

export interface IVignetteClassProps extends IVignetteProps {
    resolution: Vector2;
}

export type Language = 'en' | 'jp'