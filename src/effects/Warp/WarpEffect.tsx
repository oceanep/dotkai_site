import { Effect, BlendFunction } from "postprocessing";
import { Uniform, Vector2, WebGLRenderer, WebGLRenderTarget } from "three";
import { IWarpClassProps } from "~/utils/types";
import WarpFragmentShader from "./WarpFragmentShader.glsl";

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
    // Animate scanlines later
    // update(renderer: WebGLRenderer, inputBuffer: WebGLRenderTarget, deltaTime?: number): void {
    //     this.uniforms.get('time').value += deltaTime
    // }
}