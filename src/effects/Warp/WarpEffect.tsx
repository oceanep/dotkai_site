import { Effect, BlendFunction } from "postprocessing";
import { Uniform, WebGLRenderer, WebGLRenderTarget } from "three";
import { IWarpProps } from "~/utils/types";
import WarpFragmentShader from "./WarpFragmentShader.glsl";

export default class WarpEffect extends Effect {
    constructor({ frequency, amplitude, blendFunction = BlendFunction.DARKEN }: IWarpProps) {
        super(
            'WarpEffect',
            WarpFragmentShader,
            {
                uniforms: new Map([
                    ['frequency', new Uniform(frequency)],
                    ['amplitude', new Uniform(amplitude)],
                    ['time', new Uniform(0)]
                ]),
                blendFunction
            }
        )
    }
    update(renderer: WebGLRenderer, inputBuffer: WebGLRenderTarget, deltaTime?: number): void {
        this.uniforms.get('time').value += deltaTime
    }
}