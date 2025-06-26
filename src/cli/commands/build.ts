import { Command } from 'commander'
import { execSync } from 'child_process'
import chalk from 'chalk'
import ora from 'ora'
import path from 'path'
import fs from 'fs-extra'

export const buildCommand = new Command('build')
  .description('Build a plugin')
  .argument('[plugin-path]', 'Path to plugin directory', '.')
  .option('--no-clean', '不清理输出目录')
  .action(async (pluginPath: string, options) => {
    const spinner = ora('Building plugin...').start()
    
    try {
      process.chdir(pluginPath)
      
      // 运行 TypeScript 编译
      execSync('npx tsc', { stdio: 'pipe' })
      
      spinner.succeed('Plugin built successfully!')
      console.log(chalk.cyan('📦 Build output: ./dist/'))
      
    } catch (error) {
      spinner.fail(`Build failed: ${error instanceof Error ? error.message : error}`)
      process.exit(1)
    }
  }) 