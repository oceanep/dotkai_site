import { FC, forwardRef, useMemo } from "react";
import VignetteEffect from "./VignetteEffect"
import { IVignetteProps } from "@/utils/types";
import { useDebouncedResize } from "@/utils/hooks";

const Vignette = forwardRef<React.RefObject<FC>, IVignetteProps>((props, ref) => {
    const resolution = useDebouncedResize();
    const effect = useMemo(() => {
        const formattedResolution: [number, number] = [resolution[0] || 0, resolution[1] || 0];
        return new VignetteEffect({ resolution: formattedResolution, ...props });
    }, [props, resolution]);
    
    return <primitive ref={ref} object={effect} />
})

Vignette.displayName = "Vignette";
export default Vignette;