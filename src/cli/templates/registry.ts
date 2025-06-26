import type { TemplateConfig } from '../../types'

/**
 * 插件模板注册表
 */
export const TEMPLATES: Record<string, TemplateConfig> = {
  'webhook-trigger': {
    name: 'Webhook Trigger',
    description: '通过 HTTP 请求触发的 Webhook 节点',
    category: 'trigger',
    ports: [
      {
        id: 'output',
        type: 'output',
        label: 'Output',
        dataType: 'object'
      }
    ],
    files: {
      'package.json': JSON.stringify({
        name: "{{kebabName}}",
        version: "1.0.0",
        description: "{{description}}",
        main: "dist/index.js",
        types: "dist/index.d.ts",
        author: "{{author}}",
        license: "MIT",
        scripts: {
          dev: "tsc --watch",
          build: "tsc",
          test: "jest",
          validate: "automation-plugin-sdk validate",
          publish: "automation-plugin-sdk publish"
        },
        dependencies: {
          "@automation/plugin-sdk": "^1.0.0"
        },
        devDependencies: {
          "@types/node": "^20.0.0",
          "typescript": "^5.0.0",
          "jest": "^29.0.0",
          "@types/jest": "^29.0.0"
        }
      }, null, 2),
      'tsconfig.json': JSON.stringify({
        compilerOptions: {
          target: "ES2020",
          module: "commonjs",
          declaration: true,
          outDir: "./dist",
          rootDir: "./src",
          strict: true,
          esModuleInterop: true,
          skipLibCheck: true,
          forceConsistentCasingInFileNames: true
        },
        include: ["src/**/*"],
        exclude: ["node_modules", "dist", "tests"]
      }, null, 2),
      'plugin.manifest.json': JSON.stringify({
        name: "{{name}}",
        version: "1.0.0",
        description: "{{description}}",
        author: "{{author}}",
        nodeType: "{{kebabName}}.trigger",
        displayName: "{{name}}",
        category: "trigger",
        subCategory: "network",
        icon: "icon-trigger-started-by-webhook",
        tags: ["webhook", "http", "trigger"],
        complexity: "intermediate",
        isPopular: true,
        sdkVersion: "^1.0.0",
        metadata: {
          createdAt: "{{createdAt}}"
        }
      }, null, 2),
      'src/index.ts': `import { TriggerNode } from '@automation/plugin-sdk'
import type { PluginExecutionContext, ExecutionResult } from '@automation/plugin-sdk'

export class {{pascalName}}Plugin extends TriggerNode {
  async setup(): Promise<void> {
    console.log('Setting up {{name}}...')
  }

  async teardown(): Promise<void> {
    console.log('Tearing down {{name}}...')
  }

  async execute(inputs: Record<string, unknown>, context: PluginExecutionContext): Promise<ExecutionResult> {
    try {
      context.log('info', '{{name}} triggered', inputs)
      
      const result = {
        timestamp: new Date().toISOString(),
        data: inputs,
        nodeId: context.nodeId
      }

      return {
        success: true,
        data: result
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误'
      return {
        success: false,
        error: errorMessage
      }
    }
  }
}

export default new {{pascalName}}Plugin()`,
      'README.md': `# {{name}}

{{description}}

## 安装

\`\`\`bash
pnpm install
\`\`\`

## 开发

\`\`\`bash
pnpm dev
\`\`\`

## 构建

\`\`\`bash
pnpm build
\`\`\``,
      '.gitignore': `node_modules/
dist/
*.log
.env
.env.local
.DS_Store
`
    }
  },

  'generic': {
    name: 'Generic Plugin',
    description: '通用插件模板',
    category: 'action',
    ports: [
      {
        id: 'input',
        type: 'input',
        label: 'Input',
        dataType: 'object',
        required: true
      },
      {
        id: 'output',
        type: 'output',
        label: 'Output',
        dataType: 'object'
      }
    ],
    files: {
      'package.json': JSON.stringify({
        name: "{{kebabName}}",
        version: "1.0.0",
        description: "{{description}}",
        main: "dist/index.js",
        types: "dist/index.d.ts",
        author: "{{author}}",
        license: "MIT",
        scripts: {
          dev: "tsc --watch",
          build: "tsc",
          test: "jest",
          validate: "automation-plugin-sdk validate",
          publish: "automation-plugin-sdk publish"
        },
        dependencies: {
          "@automation/plugin-sdk": "^1.0.0"
        },
        devDependencies: {
          "@types/node": "^20.0.0",
          "typescript": "^5.0.0",
          "jest": "^29.0.0",
          "@types/jest": "^29.0.0"
        }
      }, null, 2),
      'src/index.ts': `import { PluginBase } from '@automation/plugin-sdk'
import type { PluginExecutionContext, ExecutionResult } from '@automation/plugin-sdk'

export class {{pascalName}}Plugin extends PluginBase {
  async execute(inputs: Record<string, unknown>, context: PluginExecutionContext): Promise<ExecutionResult> {
    try {
      context.log('info', '{{name}} executing', inputs)
      
      const result = {
        message: 'Plugin executed successfully',
        timestamp: new Date().toISOString(),
        inputData: inputs,
        nodeId: context.nodeId
      }

      return {
        success: true,
        data: result
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误'
      return {
        success: false,
        error: errorMessage
      }
    }
  }
}

export default new {{pascalName}}Plugin()`
    }
  }
} 