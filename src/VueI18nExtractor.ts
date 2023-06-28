import * as fs from 'fs'
import * as path from 'path'
import { parse, SFCBlock } from '@vue/compiler-sfc'
import * as vueTemplateCompiler from 'vue-template-compiler'

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
    files.forEach(file => {
      const fullPath = path.join(directory, file)
      const fileStat = fs.lstatSync(fullPath)
      if (fileStat.isDirectory()) {
        vueFiles = vueFiles.concat(this.getVueFiles(fullPath))
      } else if (path.extname(fullPath) === '.vue') {
        vueFiles.push(fullPath)
      }
    })
    return vueFiles
  }
  private extractI18nKeysFromContent(content: string): void {
    let sfc: any
    try {
      sfc = parse(content)
    } catch (error) {
      sfc = vueTemplateCompiler.parseComponent(content)
    }

    const scriptBlock = sfc.descriptor.script || sfc.descriptor.scriptSetup
    if (scriptBlock) {
      this.extractI18nKeysFromScriptBlock(scriptBlock)
    }

    const templateBlock = sfc.descriptor.template
    if (templateBlock) {
      this.extractI18nKeysFromTemplateBlock(templateBlock)
    }
  }

  private extractI18nKeysFromScriptBlock(scriptBlock: SFCBlock): void {
    const scriptContent = scriptBlock.content
    const i18nKeyPattern =
      /(?:i18n(?:-\w+)?[ (\n]\s*(?:key)?path=|v-t=['"`{]|(?:this\.|\$|i18n\.|[^\w\d])(?:t|tc|te)\()\s*['"`](.*?)['"`]/gm
    let match
    while ((match = i18nKeyPattern.exec(scriptContent)) !== null) {
      // console.log(match[1])
      this.keySet.add(match[1])
    }
  }

  private extractI18nKeysFromTemplateBlock(templateBlock: SFCBlock): void {
    const templateContent = templateBlock.content
    const i18nKeyPattern =
      /(?:i18n(?:-\w+)?[ (\n]\s*(?:key)?path=|v-t=['"`{]|(?:this\.|\$|i18n\.|[^\w\d])(?:t|tc|te)\()\s*['"`](.*?)['"`]/gm
    let match
    while ((match = i18nKeyPattern.exec(templateContent)) !== null) {
      // console.log(match[1])
      this.keySet.add(match[1])
    }
  }
}

export default VueI18nExtractor
