import { FC, forwardRef } from "react";
import DrunkEffect from "./DrunkEffect"
import { IDrunkProps } from "~/utils/types";

const Drunk = forwardRef<React.RefObject<FC>, IDrunkProps>((props, ref) => {
    const effect = new DrunkEffect(props);

    return <primitive ref={ref} object={effect} />
})

export default Drunk;