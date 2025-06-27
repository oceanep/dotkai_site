export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function throttle(func: Function, limit: number) {
  let throttling = false
  return function () {
    const args = arguments
    const context = this
    if (!throttling) {
      func.apply(context, args);
      throttling = true
      setTimeout(() => throttling = false, limit)
    }
  }
}

export function getMobilePlatform() {
  if (typeof window === 'undefined') {
    return {
      isIOS: false,
      isIphone: false,
      isAndroid: false,
    }
  }
  const screenWidth = window.screen.width
  const ua = window.navigator.userAgent

  const isIOS = /iPhone|iPod/.test(ua)
  const isAndroid = /Android/.test(ua)
  const isChrome = /CriOS|Chrome/.test(ua)
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua)

  return {
    isIOS,
    isIphone: isIOS && (isSafari || isChrome) && screenWidth < 520,
    isAndroid,
  }
}

export function getVisualViewportSize(iOS: boolean, iphone: boolean): [number, number] {
  if (typeof window === 'undefined') return [800, 600] // default SSR-safe fallback

  const width = iOS ? window.visualViewport?.width || window.innerWidth: window.innerWidth
  const height = iphone
    ? window.visualViewport?.height + 180 || window.innerHeight + 180
    : iOS
      ? window.visualViewport?.height || window.innerHeight
      : window.innerHeight

  return [width, height]
}