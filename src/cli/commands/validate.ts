import { Command } from 'commander'
import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk'
import ora from 'ora'

export const validateCommand = new Command('validate')
  .description('Validate a plugin')
  .argument('[plugin-path]', 'Path to plugin directory', '.')
  .action(async (pluginPath: string) => {
    const spinner = ora('Validating plugin...').start()
    
    try {
      const pluginDir = path.resolve(pluginPath)
      
      if (!await fs.pathExists(pluginDir)) {
        spinner.fail(`Plugin directory not found: ${pluginDir}`)
        return
      }

      const errors: string[] = []
      const warnings: string[] = []

      // 检查必需文件
      const requiredFiles = [
        'package.json',
        'plugin.manifest.json', 
        'plugin.registry.json',
        'src/index.ts',
        'README.md'
      ]

      for (const file of requiredFiles) {
        const filePath = path.join(pluginDir, file)
        if (!await fs.pathExists(filePath)) {
          errors.push(`Missing required file: ${file}`)
        }
      }

      // 检查推荐文件
      const recommendedFiles = [
        'tsconfig.json',
        '.gitignore',
        'tests/'
      ]

      for (const file of recommendedFiles) {
        const filePath = path.join(pluginDir, file)
        if (!await fs.pathExists(filePath)) {
          warnings.push(`Recommended file missing: ${file}`)
        }
      }

      // 验证 package.json
      const packageJsonPath = path.join(pluginDir, 'package.json')
      if (await fs.pathExists(packageJsonPath)) {
        const packageJson = await fs.readJson(packageJsonPath)
        
        if (!packageJson.dependencies?.['@choiceform/automation-sdk'] && 
            !packageJson.devDependencies?.['@choiceform/automation-sdk']) {
          errors.push('Missing @choiceform/automation-sdk dependency')
        }
      }

      // 验证 manifest
      const manifestPath = path.join(pluginDir, 'plugin.manifest.json')
      if (await fs.pathExists(manifestPath)) {
        const manifest = await fs.readJson(manifestPath)
        
        const requiredFields = ['name', 'version', 'description', 'author', 'nodeType', 'displayName', 'category']
        for (const field of requiredFields) {
          if (!manifest[field]) {
            errors.push(`Missing required field in manifest: ${field}`)
          }
        }
      }

      spinner.stop()

      if (errors.length === 0 && warnings.length === 0) {
        console.log(chalk.green('✅ Plugin validation passed!'))
      } else {
        if (errors.length > 0) {
          console.log(chalk.red('\n❌ Errors:'))
          errors.forEach(error => console.log(chalk.red(`  • ${error}`)))
        }
        
        if (warnings.length > 0) {
          console.log(chalk.yellow('\n⚠️  Warnings:'))
          warnings.forEach(warning => console.log(chalk.yellow(`  • ${warning}`)))
        }
        
        if (errors.length > 0) {
          process.exit(1)
        }
      }

    } catch (error) {
      spinner.fail(`Validation failed: ${error instanceof Error ? error.message : error}`)
      process.exit(1)
    }
  }) 