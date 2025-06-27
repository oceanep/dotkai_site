import { Effect, BlendFunction } from "postprocessing";
// import { Uniform, Vector2 } from "three";
import { IWarpClassProps } from "@/utils/types";
import WarpFragmentShader from "./WarpFragmentShader.glsl";
import { Uniform } from "three/src/core/Uniform";
import { Vector2 } from "three/src/math/Vector2";

export default class WarpEffect extends Effect {
    constructor({
        resolution,
        warp = 0.85,
        intensity = 0.5,
        frequency = 0.85,
        scale = 1.0,
        blendFunction = BlendFunction.DARKEN }: IWarpClassProps) {

        super(
            'WarpEffect',
            WarpFragmentShader,
            {
                uniforms: new Map([
                    ['warp', new Uniform(warp)],
                    ['s_intensity', new Uniform(intensity)],
                    ['s_frequency', new Uniform(frequency)],
                    ['scale', new Uniform(new Vector2(scale, scale))],
                    ['iResolution', new Uniform(resolution) as Uniform<any>]
                ]),
                blendFunction
            }
        )
    }
    setResolution(resolution: number[]) {
        const uniform = this.uniforms.get("iResolution");
        if (!(uniform.value && Array.isArray(uniform.value))) {
            uniform.value[0] = resolution[0];
            uniform.value[1] = resolution[1];
        } else {
            console.warn("iResolution uniform not found");
        }
    }
    // Animate scanlines later
    // update(renderer: WebGLRenderer, inputBuffer: WebGLRenderTarget, deltaTime?: number): void {
    //     this.uniforms.get('time').value += deltaTime
    // }
}