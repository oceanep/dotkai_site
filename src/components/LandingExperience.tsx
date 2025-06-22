import { FC, Suspense } from "react";
import {
    Bounds,
    Bvh,
} from '@react-three/drei'
import { Perf } from 'r3f-perf'

import Logo from '@/components/Logo'
import Parallax from "@/components/Parallax";

const LandingExperience: FC = () => {

    return (
        <Bvh>
            {<Perf position="top-left" />}
            <Suspense fallback={null}>
                <Bounds fit clip observe margin={0.9}>
                    <Logo />
                </Bounds>
            </Suspense>
            <Parallax/>
        </Bvh>
    )
};

export default LandingExperience;