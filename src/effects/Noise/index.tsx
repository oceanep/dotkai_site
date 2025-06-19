import { FC, forwardRef, useMemo } from "react";
import NoiseEffect from "./NoiseEffect";
import { INoiseProps } from "@/utils/types";
import { useDebouncedResize } from "~/utils/hooks";

const Noise = forwardRef<React.RefObject<FC>, INoiseProps>((props, ref) => {
    const resolution = useDebouncedResize();
        const effect = useMemo(() => {
            const formattedResolution: [number, number] = [resolution[0] || 0, resolution[1] || 0];
            return new NoiseEffect({ resolution: formattedResolution, ...props });
        }, [props, resolution]);

    return <primitive ref={ref} object={effect} />;
});

Noise.displayName = "Noise";
export default Noise;