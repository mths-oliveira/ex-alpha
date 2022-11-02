let timer = null
export function debounce<T = any>(func: (e?: T) => void, wait = 200) {
  return (e?: T) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func(e)
    }, wait)
  }
}
