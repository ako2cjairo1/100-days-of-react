export const pickRandom = (len: number) => Math.floor(Math.random() * len)

export const executeAfterSomeTime = (handlerFn: () => void, seconds: number) => {
    const timerId = setTimeout(() => {
        handlerFn()
        clearTimeout(timerId)
    }, seconds * 1000)
}