import { useThree, useFrame } from "@react-three/fiber";
import { useState, useEffect } from "react";
import { Color, Vector3 } from "three";

const Parallax = () => {
    const camera = useThree(state => state.camera);

    const [cursor, setCursor] = useState({x: 0, y: 0})

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
        const parallaxX = cursor.x
        const parallaxY = cursor.y
        const camPos = new Vector3(parallaxX, - parallaxY, s.camera.position.z)
        s.camera.position.copy(camPos)
    });

    return <></>
}
export default Parallax;