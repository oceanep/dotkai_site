import { FC, forwardRef, useMemo } from "react";
import WarpEffect from "./WarpEffect"
import { IWarpProps } from "~/utils/types";
import { useDebouncedResize } from "~/utils/hooks";

const Warp = forwardRef<React.RefObject<FC>, IWarpProps>((props, ref) => {
    const resolution = useDebouncedResize();
    const effect = useMemo(() => {
        const formattedResolution: [number, number] = [resolution[0] || 0, resolution[1] || 0];
        return new WarpEffect({ resolution: formattedResolution, ...props });
    }, [props, resolution]);
    
    return <primitive ref={ref} object={effect} />
})

Warp.displayName = "Warp";
export default Warp;