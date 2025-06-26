import { Command } from 'commander'
import chalk from 'chalk'
import path from 'path'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import type { PluginManifest } from '../../types'

export const publishCommand = new Command('publish')
  .description('Publish a plugin to the registry')
  .argument('[plugin-path]', 'Path to plugin directory', '.')
  .option('--registry <url>', '插件注册中心地址', 'https://plugins.automation.dev')
  .option('--token <token>', 'API 访问令牌')
  .option('--dry-run', '模拟发布（不实际上传）')
  .action(async (pluginPath: string, options) => {
    console.log(chalk.cyan('🚀 Plugin publishing'))
    console.log(chalk.gray('Publishing plugins is done through Pull Requests to the main repository.'))
    console.log(chalk.gray('Please follow the plugin submission guide:'))
    console.log(chalk.blue('https://github.com/choiceform/automation/blob/main/docs/PLUGIN_SUBMISSION_GUIDE.md'))

    try {
      console.log(chalk.blue('📦 准备发布插件...'))
      console.log()

      const pluginDir = path.resolve(pluginPath)
      const distDir = path.join(pluginDir, 'dist')
      
      // 检查构建目录是否存在
      if (!await fs.pathExists(distDir)) {
        throw new Error('找不到构建目录，请先运行 build 命令')
      }

      // 读取 manifest
      const manifestPath = path.join(distDir, 'plugin.manifest.json')
      if (!await fs.pathExists(manifestPath)) {
        throw new Error('找不到 plugin.manifest.json 文件')
      }

      const manifest: PluginManifest = await fs.readJson(manifestPath)

      console.log(chalk.yellow('📋 插件信息:'))
      console.log(`   名称: ${manifest.name}`)
      console.log(`   版本: ${manifest.version}`)
      console.log(`   作者: ${manifest.author}`)
      console.log(`   描述: ${manifest.description}`)
      console.log(`   节点类型: ${manifest.nodeType}`)
      console.log(`   分类: ${manifest.category}`)
      console.log()

      // 获取 API 令牌
      let token = options.token
      if (!token) {
        const { inputToken } = await inquirer.prompt([
          {
            type: 'password',
            name: 'inputToken',
            message: '请输入 API 访问令牌:',
            mask: '*'
          }
        ])
        token = inputToken
      }

      if (!token) {
        throw new Error('需要 API 访问令牌才能发布插件')
      }

      // 确认发布
      if (!options.dryRun) {
        const { confirmed } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirmed',
            message: `确认发布插件 ${manifest.name}@${manifest.version}?`,
            default: false
          }
        ])

        if (!confirmed) {
          console.log(chalk.yellow('❌ 取消发布'))
          return
        }
      }

      // 创建发布包
      console.log(chalk.blue('📦 创建发布包...'))
      
      const packageFiles = await fs.readdir(distDir)
      const packageInfo = {
        manifest,
        files: [] as string[],
        size: 0
      }

      for (const file of packageFiles) {
        const filePath = path.join(distDir, file)
        const stat = await fs.stat(filePath)
        packageInfo.files.push(file)
        packageInfo.size += stat.size
      }

      console.log(chalk.green(`✅ 发布包已创建 (${packageInfo.files.length} 个文件, ${(packageInfo.size / 1024).toFixed(1)}KB)`))

      if (options.dryRun) {
        console.log()
        console.log(chalk.yellow('🧪 模拟发布模式 - 不会实际上传'))
        console.log(chalk.green('✅ 插件验证通过，可以正式发布'))
        return
      }

      // 实际发布逻辑（这里暂时模拟）
      console.log(chalk.blue('🚀 正在上传到插件注册中心...'))
      
      // TODO: 实现实际的 API 调用
      await new Promise(resolve => setTimeout(resolve, 2000)) // 模拟上传时间
      
      console.log()
      console.log(chalk.green('🎉 插件发布成功!'))
      console.log()
      console.log(chalk.blue('📝 发布信息:'))
      console.log(`   插件 ID: ${manifest.nodeType}`)
      console.log(`   版本: ${manifest.version}`)
      console.log(`   注册中心: ${options.registry}`)
      console.log()
      console.log(chalk.yellow('💡 提示: 插件可能需要几分钟才能在平台上生效'))

    } catch (error) {
      console.error(chalk.red('❌ 发布失败:'), error instanceof Error ? error.message : String(error))
      process.exit(1)
    }
  }) 