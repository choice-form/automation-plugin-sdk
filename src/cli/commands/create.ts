import { Command } from 'commander'
import inquirer from 'inquirer'
import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk'
import ora from 'ora'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const createCommand = new Command('create')
  .description('Create a new plugin')
  .option('-n, --name <name>', 'Plugin name')
  .option('-a, --author <author>', 'Plugin author')
  .option('-t, --template <template>', 'Template to use', 'webhook-trigger')
  .option('-d, --description <description>', 'Plugin description')
  .action(async (options) => {
    const spinner = ora('Creating plugin...').start()
    
    try {
      // 收集插件信息
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Plugin name:',
          default: options.name,
          when: !options.name,
          validate: (input: string) => {
            if (!input.trim()) return 'Plugin name is required'
            if (!/^[a-z0-9-]+$/.test(input)) return 'Plugin name must contain only lowercase letters, numbers, and hyphens'
            return true
          }
        },
        {
          type: 'input',
          name: 'author',
          message: 'Author name:',
          default: options.author,
          when: !options.author,
          validate: (input: string) => input.trim() ? true : 'Author name is required'
        },
        {
          type: 'input',
          name: 'description',
          message: 'Plugin description:',
          default: options.description,
          when: !options.description,
          validate: (input: string) => input.trim() ? true : 'Description is required'
        },
        {
          type: 'list',
          name: 'template',
          message: 'Choose a template:',
          choices: [
            { name: 'Webhook Trigger - Handle HTTP webhooks', value: 'webhook-trigger' },
            { name: 'HTTP Action - Make HTTP requests', value: 'http-action' },
            { name: 'Data Transform - Transform data', value: 'data-transform' },
            { name: 'Generic Plugin - Start from scratch', value: 'generic' }
          ],
          default: options.template,
          when: !options.template
        }
      ])

      const pluginName = options.name || answers.name
      const author = options.author || answers.author
      const description = options.description || answers.description
      const template = options.template || answers.template

      spinner.text = `Creating plugin "${pluginName}"...`

      // 创建插件目录
      const pluginDir = path.resolve(process.cwd(), `${author}-${pluginName}`)
      
      if (await fs.pathExists(pluginDir)) {
        spinner.fail(`Directory "${author}-${pluginName}" already exists`)
        return
      }

      // 创建基础文件结构
      await fs.ensureDir(pluginDir)
      await fs.ensureDir(path.join(pluginDir, 'src'))
      await fs.ensureDir(path.join(pluginDir, 'tests'))

      // 创建 package.json
      const packageJson = {
        name: `${author}-${pluginName}`,
        version: "1.0.0",
        description: description,
        main: "dist/index.js",
        types: "dist/index.d.ts",
        scripts: {
          build: "tsc",
          dev: "tsc --watch",
          test: "jest",
          validate: "npx @choiceform/automation-sdk validate .",
          clean: "rm -rf dist"
        },
        keywords: ["automation", "plugin", pluginName],
        author: author,
        license: "MIT",
        dependencies: {
          "@choiceform/automation-sdk": "workspace:*"
        },
        devDependencies: {
          "@types/jest": "^29.5.0",
          "@types/node": "^20.0.0",
          "jest": "^29.5.0",
          "ts-jest": "^29.1.0",
          "typescript": "^5.0.0"
        },
        files: [
          "dist",
          "plugin.manifest.json",
          "plugin.registry.json",
          "README.md"
        ],
        engines: {
          node: ">=18.0.0"
        }
      }
      await fs.writeJson(path.join(pluginDir, 'package.json'), packageJson, { spaces: 2 })

      // 创建 plugin.manifest.json
      const displayName = pluginName.split('-').map((word: string) => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
      
      const manifest = {
        name: `${author}-${pluginName}`,
        version: "1.0.0",
        description: description,
        author: author,
        nodeType: `${author}-${pluginName}.trigger`,
        displayName: displayName,
        category: "trigger",
        subCategory: "network",
        icon: "icon-trigger-started-by-webhook",
        tags: [pluginName, "trigger", "automation"],
        complexity: "beginner",
        isPopular: false,
        sdkVersion: "^1.0.0",
        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
      await fs.writeJson(path.join(pluginDir, 'plugin.manifest.json'), manifest, { spaces: 2 })

      // 创建 plugin.registry.json
      const registry = {
        name: `${author}-${pluginName}`,
        version: "1.0.0",
        author: author,
        submittedAt: new Date().toISOString(),
        category: "trigger",
        security: {
          level: "standard",
          permissions: ["network"],
          sandbox: true,
          description: "Requires network access for webhook functionality"
        },
        testing: {
          coverage: 0,
          testFiles: ["tests/**/*.test.ts"],
          integrationTests: false,
          performanceTests: false
        },
        compatibility: {
          sdkVersion: "^1.0.0",
          nodeVersion: ">=18.0.0",
          platformVersion: ">=1.0.0"
        }
      }
      await fs.writeJson(path.join(pluginDir, 'plugin.registry.json'), registry, { spaces: 2 })

      // 创建 src/index.ts
      const sourceCode = `import { TriggerNode } from '@choiceform/automation-sdk'
import type { PluginExecutionContext, ExecutionResult } from '@choiceform/automation-sdk'

/**
 * ${displayName} Plugin
 * 
 * ${description}
 */
export class ${displayName.replace(/\s/g, '')} extends TriggerNode {
  async setup(): Promise<void> {
    this.logger?.info('Setting up ${displayName}...')
    // 初始化逻辑
  }

  async teardown(): Promise<void> {
    this.logger?.info('Tearing down ${displayName}...')
    // 清理逻辑
  }

  async execute(inputs: Record<string, unknown>, context: PluginExecutionContext): Promise<ExecutionResult> {
    try {
      context.log('info', '${displayName} executed', inputs)
      
      // 你的业务逻辑
      const result = {
        timestamp: new Date().toISOString(),
        processed: true,
        data: inputs,
        nodeId: context.nodeId,
        workflowId: context.workflowId
      }

      return {
        success: true,
        data: result
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误'
      context.log('error', 'Plugin execution failed', { error: errorMessage })
      
      return {
        success: false,
        error: errorMessage
      }
    }
  }
}

// 导出插件实例
export default new ${displayName.replace(/\s/g, '')}()`

      await fs.writeFile(path.join(pluginDir, 'src/index.ts'), sourceCode)

      // 创建 tsconfig.json
      const tsconfig = {
        compilerOptions: {
          target: "ES2020",
          module: "CommonJS",
          lib: ["ES2020"],
          outDir: "./dist",
          rootDir: "./src",
          strict: true,
          esModuleInterop: true,
          skipLibCheck: true,
          forceConsistentCasingInFileNames: true,
          declaration: true,
          declarationMap: true,
          sourceMap: true,
          moduleResolution: "node",
          allowSyntheticDefaultImports: true
        },
        include: ["src/**/*"],
        exclude: ["node_modules", "dist", "tests"]
      }
      await fs.writeJson(path.join(pluginDir, 'tsconfig.json'), tsconfig, { spaces: 2 })

      // 创建 README.md
      const readmeContent = `# ${displayName}

${description}

## 🎯 功能特性

- 自动化工作流触发
- 完整的错误处理
- TypeScript 类型安全

## 📋 配置选项

| 参数 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| \`enabled\` | boolean | ❌ | true | 是否启用插件 |

## 🚀 使用方法

### 基础配置

\`\`\`json
{
  "enabled": true
}
\`\`\`

## 🔧 开发和测试

\`\`\`bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 运行测试
pnpm test

# 构建插件
pnpm build

# 验证插件
pnpm validate
\`\`\`

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**由 @choiceform/automation-sdk 生成** 🚀`

      await fs.writeFile(path.join(pluginDir, 'README.md'), readmeContent)

      // 创建 .gitignore
      const gitignore = `# Dependencies
node_modules/
pnpm-lock.yaml

# Build outputs
dist/
*.tsbuildinfo

# Testing
coverage/

# Logs
*.log
npm-debug.log*
pnpm-debug.log*

# Editor
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db`

      await fs.writeFile(path.join(pluginDir, '.gitignore'), gitignore)

      spinner.succeed(`Plugin "${pluginName}" created successfully!`)
      
      console.log(chalk.cyan('\n📦 Next steps:'))
      console.log(chalk.gray(`  cd ${author}-${pluginName}`))
      console.log(chalk.gray('  pnpm install'))
      console.log(chalk.gray('  pnpm dev'))
      console.log(chalk.gray('  pnpm test'))
      console.log(chalk.gray('  pnpm build'))

    } catch (error) {
      spinner.fail(`Failed to create plugin: ${error instanceof Error ? error.message : error}`)
      process.exit(1)
    }
  }) 