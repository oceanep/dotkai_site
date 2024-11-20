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
      console.log('checking: ', args)
      func.apply(context, args);
      throttling = true
      setTimeout(() => throttling = false, limit)
    }
  }
}