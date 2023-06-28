import VueI18nExtractor from './VueI18nExtractor'
import zhCN from './zh-CN.json'
import en from './en.json'

const extractor = new VueI18nExtractor()
// 获取命令行参数
const set = extractor.extractI18nKeysFromVueFiles(process.argv[2])

const zhSet = new Set(set)
const enSet = new Set(set)

const zhKey = Object.keys(zhCN)
zhKey.forEach((key) => {
  if (zhSet.has(key)) zhSet.delete(key)
})

const enKey = Object.keys(en)
enKey.forEach((key) => {
  if (enSet.has(key)) enSet.delete(key)
})

console.log(zhSet)
console.log(zhSet.size)

console.log(enSet)
console.log(enSet.size)