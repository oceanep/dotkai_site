import { FC, Suspense, useEffect } from "react";
import {
    Bounds,
    Bvh,
} from '@react-three/drei'
import { Perf } from 'r3f-perf'

import Logo from '@/components/Logo'
import Parallax from "@/components/Parallax";

const LandingExperience: FC = () => {
    
    // useEffect(() => {
    //     setTimeout(() => {
    //         alert(`window dimensions:  ${window.innerWidth} x ${window.innerHeight}`)
    //         alert(`visualViewport dimentions: ${window.visualViewport?.width} x ${window.visualViewport?.height}`)
    //     }, 5000)
    // }, [window.visualViewport.width, window.visualViewport.height])

    return (
        <Bvh>
            {process.env.NODE_ENV === 'development' && <Perf position="top-left" />}
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