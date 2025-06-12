import { useCallback, useEffect, useState } from "react"
import { throttle } from "."
import { Vector2 } from "@react-three/fiber"

export const useDebouncedResize = (): number[] => {
    //set screen resolution
    const [size, setSize] = useState<number[]>([
        window.innerWidth,
        window.innerHeight
    ])

    const handleSetSize = useCallback(() =>
        setSize([window.innerWidth, window.innerHeight]),
    [])

    useEffect(() => {
        const debouncedResize = throttle(
            handleSetSize,
        500)
        window.addEventListener('resize', debouncedResize)
        return () => window.removeEventListener('resize', debouncedResize)
    }, [handleSetSize])

    return size
}

export const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState<boolean>(false)

    useEffect(() => {
        const media = window.matchMedia(query)
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => setMatches(media.matches)

        media.addEventListener('change', listener)
        return () => media.removeEventListener('change', listener)
    }, [matches, query])

    return matches
}