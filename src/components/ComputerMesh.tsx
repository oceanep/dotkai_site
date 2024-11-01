import { useAnimations, useGLTF } from "@react-three/drei";
import { Vector3 } from "@react-three/fiber";
import { FC, useEffect } from "react";

interface IMeshProps {
    scale?: number,
    position?: Vector3,
    rotation?: Vector3
}

const ComputerMesh:FC<IMeshProps> = (props) => {
    const computer = useGLTF('/models/smol_terrarium.glb');
    const animations = useAnimations(computer.animations, computer.scene);
    console.log(animations)

    useEffect(() => {
        const action = animations.actions.Animation
        action.reset().fadeIn(0.5).play()

        return () => {
            action.fadeOut(0.5)
        }
    }, []);

    return <primitive object={computer.scene} {...props}/>
}

export default ComputerMesh;