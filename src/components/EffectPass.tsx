"use client"

import { FC, useCallback, useEffect, useState } from "react";
import { Vector2 } from "three";
import { EffectComposer, ToneMapping, Vignette, Glitch, Noise, Bloom, DepthOfField } from "@react-three/postprocessing";
import { ToneMappingMode, BlendFunction, GlitchMode } from "postprocessing";
import { useControls, folder } from "leva";
import Warp from "~/effects/Warp";
import { throttle } from "~/utils";

const EffectPass:FC = () => {
    //Post Processing Controls
    const {
        vignetteBlendingMode,
        delay,
        duration,
        strength,
        glitchMode, 
        noiseBlendingMode,
        luminanceThreshold,
        intensity,
        focusDistance,
        focalLength,
        bokehScale,
        vignetteOn,
        glitchOn,
        noiseOn,
        bloomOn,
        dofOn
    } = useControls("post processing", {
        ['vignette']: folder({
            vignetteOn: true,
            vignetteBlendingMode: {
                options: ["NORMAL", ...Object.keys(BlendFunction).filter(k => k !== "NORMAL")]
            }
        }),
        ['glitch controls']: folder({
            glitchOn: false,
            glitchMode: {
                options: ["SPORADIC", ...Object.keys(GlitchMode).filter(k => k !== "SPORADIC")]
            },
            delay: {
                value: [0.5, 1.0]
            },
            duration: {
                value: [0.1, 0.3]
            },
            strength: {
                value: [0.2, 0.4]
            }
        }),
        ['noise controls']: folder({
            noiseOn: true,
            noiseBlendingMode: {
                options: ["OVERLAY", ...Object.keys(BlendFunction).filter(k => k !== "OVERLAY")]
            }
        }),
        ['bloom controls']: folder({
            bloomOn: true,
            luminanceThreshold: {
                min: 0.0,
                max: 2.0,
                step: 0.1,
                value: 0.7
            },
            intensity: {
                min: 0.0,
                max: 2.0,
                step: 0.1,
                value: 0.5
            }
        }),
        ['depth of field']: folder({
            dofOn: false,
            focusDistance: {
                min: 0.0,
                max: 2.0,
                step: 0.05,
                value: 0.25
            },
            focalLength: {
                min: 0.0,
                max: 2.0,
                step: 0.05,
                value: 0.65
            },
            bokehScale: {
                min: 0,
                max: 10,
                step: 1,
                value: 5
            },
        }),
    });

    //custom post processing effect controls
    const warpProps = useControls('Warp Effect', {
        frequency: {
            value: 0.85, 
            min: 0,
            max: 5,
            step: 0.1
        },
        warp: {
            value: 0.85,
            min: 0,
            max: 5,
            step: 0.1
        },
        intensity: {
            value: 0.5,
            min: 0,
            max: 2,
            step: 0.1
        },
        scale: {
            value: 1,
            min: 0,
            max: 5,
            step: 0.1
        }
    })

    const { customEffectBlendMode } = useControls('Warp Effect Blend Mode', {
        customEffectBlendMode: {
            options: ["NORMAL", ...Object.keys(BlendFunction).filter(k => k !== "NORMAL")]
        }
    })
    
    return (
        <EffectComposer multisampling={0}>
            <ToneMapping mode={ToneMappingMode.ACES_FILMIC} /> 
            {glitchOn && (
                <Glitch
                    delay={new Vector2(delay[0], delay[1])}
                    duration={new Vector2(duration[0], duration[1])}
                    strength={new Vector2(strength[0], strength[1])}
                    mode={GlitchMode[glitchMode]}
                />
            )}
            
            {dofOn && (
                <DepthOfField
                    focusDistance={focusDistance}
                    focalLength={focalLength}
                    bokehScale={bokehScale}
                />
            )}
            {/* {bloomOn && (
                <Bloom
                    luminanceThreshold={luminanceThreshold}
                    intensity={intensity}
                    mipmapBlur
                    blendFunction={BlendFunction.LUMINOSITY}
                />
            )} */}
            <Warp
                {...warpProps}
                blendFunction={BlendFunction[customEffectBlendMode]}
            />
            {noiseOn && (
                <Noise
                    opacity={0.2}
                    premultiply
                    blendFunction={BlendFunction[noiseBlendingMode]}
                />
            )}
            {vignetteOn && (
                <Vignette
                    offset={0.5}
                    darkness={0.5}
                    blendFunction={BlendFunction[vignetteBlendingMode]}
                />
            )}
        </EffectComposer>
    )
}

export default EffectPass;