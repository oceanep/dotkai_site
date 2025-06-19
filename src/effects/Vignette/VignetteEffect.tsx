import { Effect, BlendFunction } from "postprocessing";
import { IVignetteClassProps } from "@/utils/types";
import VignetteFragmentShader from "./VignetteFragmentShader.glsl";
import { Uniform } from "three/src/core/Uniform";

export default class VignetteEffect extends Effect {
    constructor({
        resolution,
        intensity = 1.0,
        blendFunction = BlendFunction.NORMAL }: IVignetteClassProps) {

        super(
            'VignetteEffect',
            VignetteFragmentShader,
            {
                uniforms: new Map([
                    ['intensity', new Uniform(intensity)],
                    ['iResolution', new Uniform(resolution) as Uniform<any>]
                ]),
                blendFunction
            }
        )
    }
}