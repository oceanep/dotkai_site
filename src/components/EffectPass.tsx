import { FC } from "react";
import { EffectComposer, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode, BlendFunction } from "postprocessing";
import { VignetteEffect } from "postprocessing";
import Warp from "@/effects/Warp";
import NoiseEffect from "@/effects/Noise";
import Vignette from "@/effects/Vignette";

const EffectPass: FC = () => {
    return (
        <EffectComposer multisampling={0}>
            <ToneMapping mode={ToneMappingMode.NEUTRAL} /> 
            <Warp
                frequency={0.85}
                warp={0.4}
                intensity={0.3}
                scale={1}
                blendFunction={BlendFunction['NORMAL']}
            />
            <Vignette
                intensity={1}
                blendFunction={BlendFunction['NORMAL']}
            />
            <NoiseEffect
                intensity={0.5}
                blendFunction={BlendFunction['OVERLAY']}
            />
        </EffectComposer>
    );
};

export default EffectPass;