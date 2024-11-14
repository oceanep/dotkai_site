import { FC, forwardRef } from "react";
import WarpEffect from "./WarpEffect"
import { IWarpProps } from "~/utils/types";

const Warp = forwardRef<React.RefObject<FC>, IWarpProps>((props, ref) => {
    const effect = new WarpEffect(props);

    return <primitive ref={ref} object={effect} />
})

export default Warp;