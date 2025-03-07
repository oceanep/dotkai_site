import { useCallback, useEffect, useState } from "react"
import { throttle } from "."
import { Vector2 } from "@react-three/fiber"

export const useDebouncedResize = (): Vector2 => {
    //set screen resolution
    const [size, setSize] = useState<Vector2>([
        window.innerWidth,
        window.innerHeight
    ])

    const handleSetSize = useCallback(() =>
        setSize([window.innerWidth, window.innerHeight]),
    [window.innerWidth, window.innerHeight])

    useEffect(() => {
        const debouncedResize = throttle(
            handleSetSize,
        500)
        window.addEventListener('resize', debouncedResize)
        return () => window.removeEventListener('resize', debouncedResize)
    }, [])

    return size
}