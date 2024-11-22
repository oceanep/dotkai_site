import { FC, forwardRef, useMemo } from "react";
import WarpEffect from "./WarpEffect"
import { IWarpProps } from "~/utils/types";
import { useDebouncedResize } from "~/utils/hooks";

const Warp = forwardRef<React.RefObject<FC>, IWarpProps>((props, ref) => {
    const resolution = useDebouncedResize();
    console.log(props)
    const effect = useMemo(() => new WarpEffect({ resolution, ...props}), [props]);
    
    return <primitive ref={ref} object={effect} />
})

export default Warp;