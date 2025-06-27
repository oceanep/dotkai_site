import { useCallback, useEffect, useState } from "react"
import { getMobilePlatform, getVisualViewportSize, throttle } from "."

export const useDebouncedResize = (): number[] => {

    const { isIphone, isAndroid, isIOS } = getMobilePlatform()
  
    //set screen resolution
    const [size, setSize] = useState<number[]>(
        getVisualViewportSize(isIOS ? true : false, isIphone)
    )

    const handleSetSize = useCallback(() =>{
        setSize(
                getVisualViewportSize(isIOS ? true : false, isIphone)
            )},
    [isIOS, isIphone])

    useEffect(() => {
        const debouncedResize = throttle(
            handleSetSize,
        500)

        window.addEventListener('resize', debouncedResize)
        window.visualViewport?.addEventListener('resize', debouncedResize)

        return () => {
            window.removeEventListener('resize', debouncedResize)
            window.visualViewport?.removeEventListener('resize', debouncedResize)
        }
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