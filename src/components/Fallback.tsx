import { FC, useRef } from "react";
import { Float, Text } from "@react-three/drei";
import { Vector3 } from "@react-three/fiber";

interface TFallbackProps {
    fontSize?: number,
    color?: string,
    position?: Vector3,
}

const Fallback:FC<TFallbackProps> = (props) => {
    return (
        <Float
            speed={5}
            floatIntensity={2}
        >
            <Text
                font="/fonts/mofuji04.ttf"
                maxWidth={2}
                textAlign="center"
                castShadow
                {...props}
            >
                LOADING...
            </Text>
        </Float>
    );
}

export default Fallback;