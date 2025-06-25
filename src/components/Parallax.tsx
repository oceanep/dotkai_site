import { useThree, useFrame } from "@react-three/fiber";

import { useState, useEffect, useRef, useMemo } from "react";
import { Vector3 } from "three/src/math/Vector3";
import { Mesh } from "three/src/objects/Mesh";

interface iParallax {
    secondaryPos?: Vector3
    ready?: boolean
}
const Parallax = ({ secondaryPos = undefined, ready = true }: iParallax) => {
    const [cursor, setCursor] = useState({x: 0, y: 0})

    const foci = useRef<Mesh>(null!);
    const prevSecondary = useRef<Vector3 | undefined>(undefined);
    
    const camera = useThree(state => state.camera);
    
    const initCamPos = useMemo(() => ({
        x: camera.position.x || 0,
        y: camera.position.y || 0, 
        z: camera.position.z || 3.5
    }), [ready]);

    const handleCursor = (e) => 
        //cursor returns as a decimal of 1 so subtract .5 to get accurate mapping to screen
        setCursor({
            x: e.clientX / window.innerWidth - 0.5,
            y: e.clientY / window.innerHeight - 0.5
        });

    useEffect(() => {
        window.addEventListener('mousemove', handleCursor)
        return () => window.removeEventListener('mousemove', handleCursor);
    }, []);

    useEffect(() => {
        const wasDefined = !!prevSecondary.current;
        const isDefined = !!secondaryPos;
        if (wasDefined !== isDefined) {
            setCursor({ x: 0, y: 0 });
        }

        prevSecondary.current = secondaryPos;
    }, [secondaryPos]);


    useFrame((s, delta) => {
        if (!ready || !s.camera || !foci.current) return
        const amplitude = 1.2
        //add starting position of camera to compensate for none 0,0 origin
        const parallaxX = (cursor.x + initCamPos.x) * amplitude
        const parallaxY = - (cursor.y - initCamPos.y) * amplitude

        const easing = 3 * delta

        s.camera.position.x += (parallaxX - s.camera.position.x) * easing
        s.camera.position.y += (parallaxY - s.camera.position.y) * easing
        
        if (secondaryPos !== undefined) {
            // if (!Number.isFinite(secondaryPos.x)) return
            s.camera.lookAt(
                secondaryPos
                // s.camera.position
                // .clone()
                // .lerp(secondaryPos, delta * 5)
            )  
        } 
        if (secondaryPos === undefined) s.camera.lookAt(foci.current.position)
    });

    return (
        <mesh
            position={[0, 0, -0.1]}
            scale={0.05}
            ref={foci}
            visible={false}
        >
            <boxGeometry />
            <meshBasicMaterial/>
        </mesh>
    )
}
export default Parallax;