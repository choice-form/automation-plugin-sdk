import path from 'path'
import fs from 'fs-extra'
import { TEMPLATES } from '../templates/registry'
import { generatePluginDirectoryName, sanitizePluginName } from '../../utils'
import type { CreatePluginOptions } from '../../types'

/**
 * 生成插件项目
 */
export async function generatePlugin(options: CreatePluginOptions): Promise<string> {
  const { name, template, author, description, outputDir = '.' } = options

  // 获取模板配置
  const templateConfig = TEMPLATES[template]
  if (!templateConfig) {
    throw new Error(`未知的模板类型: ${template}`)
  }

  // 生成项目目录名
  const projectName = generatePluginDirectoryName(name, templateConfig.category)
  const projectPath = path.resolve(outputDir, projectName)

  // 检查目录是否已存在
  if (await fs.pathExists(projectPath)) {
    throw new Error(`目录已存在: ${projectPath}`)
  }

  // 创建项目目录
  await fs.ensureDir(projectPath)

  // 准备模板变量
  const templateVars: Record<string, string> = {
    name,
    description: description || `${name} plugin for Automation platform`,
    author: author || 'Unknown',
    kebabName: sanitizePluginName(name),
    pascalName: toPascalCase(sanitizePluginName(name)),
    camelName: toCamelCase(sanitizePluginName(name)),
    category: templateConfig.category,
    createdAt: new Date().toISOString()
  }

  // 生成文件
  for (const [relativePath, templateContent] of Object.entries(templateConfig.files)) {
    const filePath = path.join(projectPath, relativePath)
    const processedContent = processTemplate(templateContent, templateVars)
    
    // 确保目录存在
    await fs.ensureDir(path.dirname(filePath))
    
    // 写入文件
    await fs.writeFile(filePath, processedContent, 'utf-8')
  }

  return projectPath
}

/**
 * 处理模板字符串
 */
function processTemplate(template: string, vars: Record<string, string>): string {
  let result = template
  
  for (const [key, value] of Object.entries(vars)) {
    const placeholder = new RegExp(`{{${key}}}`, 'g')
    result = result.replace(placeholder, value)
  }
  
  return result
}

/**
 * 转换为 PascalCase
 */
function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
}

/**
 * 转换为 camelCase
 */
function toCamelCase(str: string): string {
  const pascalCase = toPascalCase(str)
  return pascalCase.charAt(0).toLowerCase() + pascalCase.slice(1)
} 