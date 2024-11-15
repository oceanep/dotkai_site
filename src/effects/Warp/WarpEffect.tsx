import { Effect, BlendFunction } from "postprocessing";
import { Uniform, Vector2, WebGLRenderer, WebGLRenderTarget } from "three";
import { IWarpProps } from "~/utils/types";
import WarpFragmentShader from "./WarpFragmentShader.glsl";

export default class WarpEffect extends Effect {
    constructor({ frequency, amplitude, blendFunction = BlendFunction.DARKEN }: IWarpProps) {
        const resolution = new Vector2(window.innerWidth, window.innerHeight)
        super(
            'WarpEffect',
            WarpFragmentShader,
            {
                uniforms: new Map([
                    ['warp', new Uniform(0.75)],
                    ['scan', new Uniform(0.75)],
                    ['iResolution', new Uniform(resolution) as Uniform<any>]
                ]),
                blendFunction
            }
        )
    }
    // update(renderer: WebGLRenderer, inputBuffer: WebGLRenderTarget, deltaTime?: number): void {
    //     this.uniforms.get('time').value += deltaTime
    // }
}