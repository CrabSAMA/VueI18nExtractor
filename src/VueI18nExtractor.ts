import * as fs from 'fs'
import * as path from 'path'

class VueI18nExtractor {
  private vueFiles: string[]
  private keySet: Set<string>

  constructor() {
    this.vueFiles = []
    this.keySet = new Set()
  }

  public extractI18nKeysFromVueFiles(directory: string): Set<string> {
    this.vueFiles = this.getVueFiles(directory)
    this.vueFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8')
      this.extractI18nKeysFromContent(content)
    })
    return this.keySet
  }

  private getVueFiles(directory: string): string[] {
    let vueFiles: string[] = []
    const files = fs.readdirSync(directory)
    const extNameList = ['.vue', '.html', '.js', '.jsx', '.ts', '.tsx', '.ejs']
    files.forEach(file => {
      const fullPath = path.join(directory, file)
      const fileStat = fs.lstatSync(fullPath)
      if (fileStat.isDirectory()) {
        vueFiles = vueFiles.concat(this.getVueFiles(fullPath))
      } else if (extNameList.includes(path.extname(fullPath))) {
        vueFiles.push(fullPath)
      }
    })
    return vueFiles
  }
  private extractI18nKeysFromContent(content: string): void {
    // this pattern thanks for i18n-ally!
    // https://github.com/lokalise/i18n-ally/blob/main/src/frameworks/vue.ts#L33C4-L33C4
    const i18nKeyPattern =
      /(?:i18n(?:-\w+)?[ (\n]\s*(?:key)?path=|v-t=['"`{]|(?:this\.|\$|i18n\.|[^\w\d])(?:t|tc|te)\()\s*['"`](.*?)['"`]/gm
    let match
    while ((match = i18nKeyPattern.exec(content)) !== null) {
      // console.log(match[1])
      this.keySet.add(match[1])
    }
  }
}

export default VueI18nExtractor
