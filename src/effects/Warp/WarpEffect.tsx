import { Effect, BlendFunction } from "postprocessing";
import { Uniform, WebGLRenderer, WebGLRenderTarget } from "three";
import { IWarpProps } from "~/utils/types";

const fragmentShader = /* glsl */`
    uniform float frequency;
    uniform float amplitude;
    uniform float time;
    
    void mainUv(inout vec2 uv) {
        uv.y += sin(uv.x * frequency + time) * amplitude;
    }

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        outputColor = vec4(0.8, 1.0, 0.5, inputColor.a);
    }
`

export default class WarpEffect extends Effect {
    constructor({ frequency, amplitude, blendFunction = BlendFunction.DARKEN }: IWarpProps) {
        super(
            'WarpEffect',
            fragmentShader,
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