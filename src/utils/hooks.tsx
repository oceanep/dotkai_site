import { useCallback, useEffect, useState } from "react"
import { getMobilePlatform, getVisualViewportSize, throttle } from "."

export const useDebouncedResize = (): number[] => {

    const { isIphoneSafari, isIphoneChrome, isAndroid, isIOS } = getMobilePlatform()
    // alert(`window dimensions:  ${window.innerWidth} x ${window.innerHeight}`)
    // alert(`visualViewport dimentions: ${window.visualViewport?.width} x ${window.visualViewport?.height}`)
    // useEffect(() => {
    //     if (isIphoneSafari) {
    //       alert('✅ This is iPhone Safari')
    //     } else if (isIphoneChrome) {
    //       alert('ℹ️ This is iPhone Chrome')
    //     } else if (isAndroid) {
    //       alert('🤖 Android browser detected')
    //     } else if (isIOS) {
    //       alert('📱 iOS device but not Safari or Chrome')
    //     } else {
    //       alert('🖥 Not a mobile browser')
    //     }
    //   }, [isIphoneSafari, isIphoneChrome, isAndroid, isIOS])
      
    //set screen resolution
    const [size, setSize] = useState<number[]>(
        getVisualViewportSize(isIOS || isIphoneSafari ? true : false)
    )

    const handleSetSize = useCallback(() =>{
        // console.log('window dimensions: ', window.innerWidth, window.innerHeight)
        // console.log('visualViewport dimentions: ', window.visualViewport?.width, window.visualViewport?.height)
        console.log('is ios? ', isIOS|| isIphoneSafari)
        setSize(
                getVisualViewportSize(isIOS || isIphoneSafari ? true : false)
            )},
    [isIOS, isAndroid])

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