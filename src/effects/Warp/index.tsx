import { FC, forwardRef, useEffect, useMemo, useState } from "react";
import WarpEffect from "./WarpEffect"
import { IWarpProps } from "@/utils/types";
import { useDebouncedResize } from "@/utils/hooks";
import { getMobilePlatform } from "~/utils";

const Warp = forwardRef<React.RefObject<FC>, IWarpProps>((props, ref) => {
    const { isIOS } = getMobilePlatform()
    const MAX_FRAMES = isIOS ? 5 : 0
    const resolution = useDebouncedResize()

    // const [effect, setEffect] = useState<WarpEffect | null>(null);
    const [shouldInit, setShouldInit] = useState(false);
    
    // Apple are assholes so we gotta check again to make sure the ACTUAL screensize is there
    useEffect (() => {
        let frameId: number;
        let frameCount = 0;

        const waitFrames = () => {
            // console.log('waiting frames: ', frameCount)
            if (frameCount < MAX_FRAMES) {
                frameCount++
                frameId = requestAnimationFrame(waitFrames)
            } else {
                setShouldInit(true)
            }
        }
        frameId = requestAnimationFrame(waitFrames);
        return () => cancelAnimationFrame(frameId)
    }, [MAX_FRAMES, setShouldInit])

    const effect = useMemo(() => {
        if (Array.isArray(resolution) || shouldInit) {
            // console.log('resolution format running', resolution)
            const formattedResolution: [number, number] = [
                resolution[0] > 0 ? resolution[0] : window.innerWidth,
                resolution[1] > 0 ? resolution[1] : window.innerHeight,
            ];
            return new WarpEffect({ resolution: formattedResolution, ...props })
        }
    }, [resolution, shouldInit])

    
    return effect ? <primitive ref={ref} object={effect} /> : null
})

Warp.displayName = "Warp";
export default Warp;