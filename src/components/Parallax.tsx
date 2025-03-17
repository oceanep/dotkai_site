import { useThree, useFrame } from "@react-three/fiber";
import { useState, useEffect, useRef, useMemo } from "react";
import { Mesh, Vector3 } from "three";

const Parallax = () => {
    const camera = useThree(state => state.camera);
    const foci = useRef<Mesh>(null!);

    const [cursor, setCursor] = useState({x: 0, y: 0})
    
    const initCamPos = useMemo(() => ({
        x: camera.position.x || 0,
        y: camera.position.y || 0.5, 
        z: camera.position.z || 3.5
    }), [])

    const handleCursor = (e) => 
        setCursor({
            x: e.clientX / window.innerWidth - 0.5,
            y: e.clientY / window.innerHeight - 0.5
        });

    useEffect(() => {
        window.addEventListener('mousemove', handleCursor)
        return () => window.removeEventListener('mousemove', handleCursor);
    }, []);

    useFrame((s, delta) => {
        const amplitude = 1.2
        //add starting position of camera to compensate for none 0,0 origin
        const parallaxX = (cursor.x + initCamPos.x) * amplitude
        const parallaxY = - (cursor.y - initCamPos.y) * amplitude

        const easing = 3 * delta

        s.camera.position.x += (parallaxX - s.camera.position.x) * easing
        s.camera.position.y += (parallaxY - s.camera.position.y) * easing

        s.camera.lookAt(foci.current.position)
    });

    return (
        <mesh
            position={[0, 0.5, -0.1]}
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