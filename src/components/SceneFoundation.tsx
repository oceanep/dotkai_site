import { memo } from "react";
import Artifacts from "./Artifacts";
import EffectPass from "./EffectPass";
import Lighting from "./Lighting";

const SceneFoundation = memo(() => {
    const MemoizedEffectPass = memo(EffectPass);
    const MemoizedLighting = memo(Lighting);
    return (
        <>
            <Artifacts />
            <MemoizedEffectPass />
            <MemoizedLighting />
        </>)
});

export default SceneFoundation