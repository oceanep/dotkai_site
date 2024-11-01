import { useAnimations, useGLTF } from "@react-three/drei";
import { Vector3 } from "@react-three/fiber";
import { FC, useEffect } from "react";
import { IMeshProps } from "~/utils/types";

const ComputerMesh:FC<IMeshProps> = (props) => {
    const computer = useGLTF('/models/smol_terrarium.glb');
    const animations = useAnimations(computer.animations, computer.scene);

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