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

// 拼接规格值
export const specValues = (spec: any) => {
  const copySpec = JSON.parse(JSON.stringify(spec))
  delete copySpec.package
  return Object.values(copySpec).join(' ')
  // .filter((value) => value && value !== '<UNKNOWN>')
}
