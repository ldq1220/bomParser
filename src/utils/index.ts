export const getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

// 截取文件名
export const getFileName = (url: string) => {
    if (!url) return ''
    return url.split('/').pop()
}
