import { Effect, BlendFunction } from "postprocessing";
import { Uniform } from "three";
import NoiseFragmentShader from "./NoiseFragmentShader.glsl";
import { INoiseClassProps } from "~/utils/types";

export default class NoiseEffect extends Effect {
    constructor({
            intensity = 0.5, 
            speed = 0, 
            resolution,
            blendFunction = BlendFunction.NORMAL 
        }: INoiseClassProps) {
        super("NoiseEffect", NoiseFragmentShader, {
            uniforms: new Map([
                ["opacity", new Uniform(intensity)],
                ["time", new Uniform(speed)],
                ['iResolution', new Uniform(resolution) as Uniform<any>]
            ]),
            blendFunction,
        });
    }

    update(renderer, inputBuffer, deltaTime) {
        this.uniforms.get("time").value += deltaTime;
    }
}