import { Command } from "commander";
import inquirer from "inquirer";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import ora from "ora";

// 技术模板定义
const TECHNICAL_TEMPLATES = [
  {
    name: "🎯 Trigger - Listen for events (webhooks, schedules, etc.)",
    value: "trigger",
    baseClass: "TriggerNode",
    category: "trigger",
  },
  {
    name: "⚡ Action - Perform operations (API calls, notifications, etc.)",
    value: "action",
    baseClass: "ActionNode",
    category: "action",
  },
  {
    name: "🔄 Transform - Process and modify data",
    value: "transform",
    baseClass: "TransformNode",
    category: "transform",
  },
  {
    name: "🤖 AI - AI-powered processing (text, image, etc.)",
    value: "ai",
    baseClass: "AINode",
    category: "ai",
  },
  {
    name: "🔀 Control - Flow control (conditions, loops, etc.)",
    value: "control",
    baseClass: "ControlNode",
    category: "control",
  },
];

// 业务域定义
const BUSINESS_DOMAINS = [
  {
    name: "💬 Communication (Discord, Slack, Email, etc.)",
    value: "communication",
    description: "Messaging, chat, and communication platforms",
  },
  {
    name: "🤖 AI & ML (OpenAI, Claude, Processing, etc.)",
    value: "ai",
    description: "Artificial intelligence and machine learning services",
  },
  {
    name: "🗄️ Database (MySQL, PostgreSQL, MongoDB, etc.)",
    value: "database",
    description: "Database operations and data storage",
  },
  {
    name: "☁️ Storage (AWS S3, Google Drive, etc.)",
    value: "storage",
    description: "File storage and cloud storage services",
  },
  {
    name: "📊 Analytics (Google Analytics, Mixpanel, etc.)",
    value: "analytics",
    description: "Data analytics and tracking services",
  },
  {
    name: "💼 CRM (Salesforce, HubSpot, etc.)",
    value: "crm",
    description: "Customer relationship management systems",
  },
  {
    name: "💰 Finance (Stripe, PayPal, etc.)",
    value: "finance",
    description: "Payment processing and financial services",
  },
  {
    name: "📝 Productivity (Notion, Airtable, etc.)",
    value: "productivity",
    description: "Productivity tools and workspace applications",
  },
  {
    name: "🔧 System (Webhooks, HTTP, Files, etc.)",
    value: "system",
    description: "System utilities and core functionality",
  },
];

export const createCommand = new Command("create")
  .description("Create a new plugin")
  .action(async () => {
    console.log(chalk.cyan("🚀 Create New Plugin\n"));

    try {
      // 基础信息收集
      console.log(chalk.yellow("✨ Basic Information:"));
      const basicInfo = await inquirer.prompt([
        {
          type: "input",
          name: "name",
          message: "Plugin name:",
          validate: (input: string) => {
            if (!input.trim()) return "Plugin name is required";
            if (!/^[a-z0-9-]+$/.test(input))
              return "Plugin name must contain only lowercase letters, numbers, and hyphens";
            return true;
          },
        },
        {
          type: "input",
          name: "author",
          message: "Author name:",
          validate: (input: string) =>
            input.trim() ? true : "Author name is required",
        },
        {
          type: "input",
          name: "description",
          message: "Description:",
          validate: (input: string) =>
            input.trim() ? true : "Description is required",
        },
      ]);

      // 技术模板选择
      console.log(chalk.yellow("\n🔧 Technical Template:"));
      const technicalChoice = await inquirer.prompt([
        {
          type: "list",
          name: "template",
          message: "Choose plugin type:",
          choices: TECHNICAL_TEMPLATES,
          pageSize: 5,
        },
      ]);

      // 业务域选择
      console.log(chalk.yellow("\n📁 Business Domain:"));
      const domainChoice = await inquirer.prompt([
        {
          type: "list",
          name: "domain",
          message: "Choose business category:",
          choices: BUSINESS_DOMAINS,
          pageSize: 9,
        },
      ]);

      // 高级选项
      console.log(chalk.yellow("\n🎯 Advanced Options:"));
      const advancedOptions = await inquirer.prompt([
        {
          type: "confirm",
          name: "includeTests",
          message: "Include example tests:",
          default: true,
        },
        {
          type: "confirm",
          name: "strictMode",
          message: "Include TypeScript strict mode:",
          default: true,
        },
      ]);

      const selectedTemplate = TECHNICAL_TEMPLATES.find(
        (t) => t.value === technicalChoice.template
      )!;
      const selectedDomain = BUSINESS_DOMAINS.find(
        (d) => d.value === domainChoice.domain
      )!;

      const spinner = ora("Creating plugin...").start();

      // 创建插件目录
      const pluginDir = path.resolve(
        process.cwd(),
        `${selectedTemplate.value}/${basicInfo.name}`
      );

      if (await fs.pathExists(pluginDir)) {
        spinner.fail(
          `Directory "${selectedDomain.value}/${basicInfo.name}" already exists`
        );
        return;
      }

      // 创建目录结构
      await fs.ensureDir(pluginDir);
      await fs.ensureDir(path.join(pluginDir, "src"));
      if (advancedOptions.includeTests) {
        await fs.ensureDir(path.join(pluginDir, "tests"));
      }

      // 生成package.json
      const packageJson = {
        name: `@choiceform/${basicInfo.name}`,
        version: "1.0.0",
        description: basicInfo.description,
        main: "dist/index.js",
        types: "dist/index.d.ts",
        scripts: {
          build: "tsc",
          dev: "tsc --watch",
          test: advancedOptions.includeTests ? "jest" : undefined,
          validate: "npx @choiceform/automation-sdk validate .",
          clean: "rm -rf dist",
        },
        keywords: [
          "automation",
          "plugin",
          basicInfo.name,
          selectedDomain.value,
          selectedTemplate.category,
        ],
        author: basicInfo.author,
        license: "MIT",
        dependencies: {
          "@choiceform/automation-sdk": "^1.0.0",
        },
        devDependencies: {
          "@types/node": "^20.0.0",
          typescript: "^5.0.0",
          ...(advancedOptions.includeTests && {
            "@types/jest": "^29.5.0",
            jest: "^29.5.0",
            "ts-jest": "^29.1.0",
          }),
        },
        files: [
          "dist",
          "plugin.manifest.json",
          "plugin.registry.json",
          "README.md",
          "icon.svg",
        ],
        engines: {
          node: ">=18.0.0",
        },
      };

      // 移除undefined值
      (packageJson as any).scripts = Object.fromEntries(
        Object.entries(packageJson.scripts).filter(([_, v]) => v !== undefined)
      );

      await fs.writeJson(path.join(pluginDir, "package.json"), packageJson, {
        spaces: 2,
      });

      // 生成plugin.manifest.json
      const displayName = basicInfo.name
        .split("-")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      // 生成automation兼容的节点类型
      const pluginNodeType = `@choiceform/${basicInfo.name}.${selectedTemplate.category}`;
      const automationNodeType = `${selectedTemplate.category}.${basicInfo.name}`;

      // 生成automation配置
      const automationConfigs = generateAutomationConfigs(
        basicInfo,
        selectedTemplate,
        selectedDomain,
        displayName,
        automationNodeType
      );

      const manifest = {
        name: `@choiceform/${basicInfo.name}`,
        version: "1.0.0",
        description: basicInfo.description,
        author: basicInfo.author,

        // 双重节点类型标识
        nodeType: pluginNodeType, // @choiceform/discord.action
        automationNodeType: automationNodeType, // action.discord

        displayName: displayName,
        category: selectedTemplate.category,
        domain: selectedDomain.value,
        subCategory: selectedDomain.value,
        icon: "icon.svg", // 插件内的图标文件
        tags: [
          basicInfo.name,
          selectedTemplate.category,
          selectedDomain.value,
          "automation",
        ],
        isPopular: false,
        sdkVersion: "^1.0.0",

        // automation系统需要的配置
        automationConfigs: automationConfigs,

        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
      await fs.writeJson(
        path.join(pluginDir, "plugin.manifest.json"),
        manifest,
        { spaces: 2 }
      );

      // 生成plugin.registry.json
      const registry = {
        name: `@choiceform/${basicInfo.name}`,
        version: "1.0.0",
        author: basicInfo.author,
        submittedAt: new Date().toISOString(),
        category: selectedTemplate.category,
        domain: selectedDomain.value,
        security: {
          level: "standard",
          permissions:
            selectedTemplate.category === "trigger"
              ? ["network"]
              : ["network", "data"],
          sandbox: true,
          description: `Plugin for ${selectedDomain.description.toLowerCase()}`,
        },
        testing: {
          coverage: 0,
          testFiles: advancedOptions.includeTests ? ["tests/**/*.test.ts"] : [],
          integrationTests: false,
          performanceTests: false,
        },
        compatibility: {
          sdkVersion: "^1.0.0",
          nodeVersion: ">=18.0.0",
          platformVersion: ">=1.0.0",
        },
      };
      await fs.writeJson(
        path.join(pluginDir, "plugin.registry.json"),
        registry,
        { spaces: 2 }
      );

      // 生成源代码
      const sourceCode = generateSourceCode(
        basicInfo,
        selectedTemplate,
        selectedDomain,
        displayName
      );
      await fs.writeFile(path.join(pluginDir, "src/index.ts"), sourceCode);

      // 生成tsconfig.json
      const tsconfig = {
        compilerOptions: {
          target: "ES2020",
          module: "CommonJS",
          lib: ["ES2020"],
          outDir: "./dist",
          strict: advancedOptions.strictMode,
          esModuleInterop: true,
          skipLibCheck: true,
          forceConsistentCasingInFileNames: true,
          declaration: true,
          declarationMap: true,
          sourceMap: true,
          moduleResolution: "node",
          allowSyntheticDefaultImports: true,
          types: ["jest", "node"],
        },
        include: [
          "src/**/*",
          ...(advancedOptions.includeTests ? ["tests/**/*"] : []),
        ],
        exclude: ["node_modules", "dist"],
      };
      await fs.writeJson(path.join(pluginDir, "tsconfig.json"), tsconfig, {
        spaces: 2,
      });

      // 生成README.md
      const readmeContent = generateReadme(
        basicInfo,
        selectedTemplate,
        selectedDomain,
        displayName
      );
      await fs.writeFile(path.join(pluginDir, "README.md"), readmeContent);

      // 生成测试文件和配置
      if (advancedOptions.includeTests) {
        const testContent = generateTestCode(
          basicInfo,
          selectedTemplate,
          displayName
        );
        await fs.writeFile(
          path.join(pluginDir, "tests/index.test.ts"),
          testContent
        );

        // 生成 Jest 配置
        const jestConfig = generateJestConfig();
        await fs.writeFile(path.join(pluginDir, "jest.config.js"), jestConfig);

        // 生成 mock 文件
        await fs.ensureDir(path.join(pluginDir, "tests/__mocks__/@choiceform"));
        const mockContent = generateMockContent();
        await fs.writeFile(
          path.join(pluginDir, "tests/__mocks__/@choiceform/automation-sdk.ts"),
          mockContent
        );
      }

      // 生成.gitignore
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
Thumbs.db`;

      await fs.writeFile(path.join(pluginDir, ".gitignore"), gitignore);

      // 生成默认的SVG图标
      const defaultIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="3" y="3" width="18" height="18" rx="3" fill="#3b82f6"/>
  <path d="M12 7v10m-5-5h10" stroke="white" stroke-width="2" stroke-linecap="round"/>
</svg>`;
      await fs.writeFile(path.join(pluginDir, "icon.svg"), defaultIcon);

      spinner.succeed(`Plugin "${basicInfo.name}" created successfully!`);

      console.log(chalk.cyan("\n📦 Plugin Details:"));
      console.log(
        chalk.gray(`  📁 Location: ${selectedDomain.value}/${basicInfo.name}`)
      );
      console.log(
        chalk.gray(`  🔧 Type: ${selectedTemplate.name.split(" - ")[0]}`)
      );
      console.log(
        chalk.gray(`  📂 Domain: ${selectedDomain.name.split(" (")[0]}`)
      );
      console.log(chalk.gray(`  📦 Package: @choiceform/${basicInfo.name}`));

      console.log(chalk.cyan("\n🚀 Next steps:"));
      console.log(chalk.gray(`  cd ${selectedDomain.value}/${basicInfo.name}`));
      console.log(chalk.gray("  pnpm install"));
      console.log(chalk.gray("  pnpm dev"));
      if (advancedOptions.includeTests) {
        console.log(chalk.gray("  pnpm test"));
      }
      console.log(chalk.gray("  pnpm build"));
      console.log(chalk.gray("  pnpm validate"));
    } catch (error) {
      console.error(
        chalk.red(
          `\nFailed to create plugin: ${
            error instanceof Error ? error.message : error
          }`
        )
      );
      process.exit(1);
    }
  });

// 生成源代码的函数
function generateSourceCode(
  basicInfo: any,
  template: any,
  domain: any,
  displayName: string
): string {
  const className = displayName.replace(/\s/g, "");

  const baseImports = `import { ${template.baseClass} } from '@choiceform/automation-sdk'
import type { PluginExecutionContext, ExecutionResult, PluginManifest, PortConfig } from '@choiceform/automation-sdk'`;

  const classTemplate = `/**
 * ${displayName} Plugin
 *
 * ${basicInfo.description}
 *
 * Domain: ${domain.description}
 * Type: ${template.category}
 */
export class ${className} extends ${template.baseClass} {
  async setup(): Promise<void> {
    this.logger?.info('Setting up ${displayName}...')
    // 初始化逻辑
  }

  async teardown(): Promise<void> {
    this.logger?.info('Tearing down ${displayName}...')
    // 清理逻辑
  }

  getManifest(): PluginManifest {
    return {
      name: '@choiceform/${basicInfo.name}',
      version: '1.0.0',
      description: '${basicInfo.description}',
      author: '${basicInfo.author}',
      nodeType: '@choiceform/${basicInfo.name}.${template.category}',
      automationNodeType: '${template.category}.${basicInfo.name}',
      displayName: '${displayName}',
      category: '${template.category}',
      domain: '${domain.value}',
      subCategory: '${domain.value}',
      icon: 'icon.svg',
      tags: ['${basicInfo.name}', '${template.category}', '${domain.value}', 'automation'],
      isPopular: false,
      sdkVersion: '^1.0.0',
      automationConfigs: {
        registry: {
          type: '${template.category}.${basicInfo.name}',
          name: '${displayName}',
          description: '${basicInfo.description}',
          categoryId: '${template.category}',
          subCategoryId: '${domain.value}',
          icon: 'icon.svg',
          tags: ['${basicInfo.name}', '${template.category}', '${domain.value}', 'automation'],
          isPopular: false
        },
        ports: {
          ports: [
            {
              id: 'input',
              type: 'input',
              label: 'Input',
              allowMultiple: false
            },
            {
              id: 'output',
              type: 'output',
              label: 'Response',
              allowMultiple: true
            }
          ]
        },
        toolbar: {
          position: 'top',
          buttons: ['run', 'delete', 'activate', 'more'],
          showContent: true
        },
        layout: {
          width: 180,
          minHeight: 100,
          showContent: true
        }
      },
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
  }

  getPortConfig(): PortConfig {
    return {
      ports: [
        {
          id: 'input',
          type: 'input',
          label: 'Input',
          allowMultiple: false
        },
        {
          id: 'output',
          type: 'output',
          label: 'Response',
          allowMultiple: true
        }
      ]
    }
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
        workflowId: context.workflowId,
        domain: '${domain.value}',
        category: '${template.category}'
      }

      return {
        success: true,
        data: result
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误'

      // 确保 log 调用也在 try-catch 中，避免二次错误
      try {
        context.log('error', 'Plugin execution failed', { error: errorMessage })
      } catch (logError) {
        // 如果 log 本身出错，忽略它
      }

      return {
        success: false,
        error: errorMessage
      }
    }
  }
}

// 导出插件实例
export default new ${className}()`;

  return `${baseImports}\n\n${classTemplate}`;
}

// 生成README的函数
function generateReadme(
  basicInfo: any,
  template: any,
  domain: any,
  displayName: string
): string {
  return `# ${displayName}

${basicInfo.description}

## 🎯 功能特性

- ${template.name.split(" - ")[1]}
- 完整的错误处理
- TypeScript 类型安全
- ${domain.description}

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

**由 @choiceform/automation-sdk 生成** 🚀

- **类型**: ${template.category}
- **域**: ${domain.value}
- **复杂度**: ${basicInfo.complexity || "beginner"}`;
}

// 生成测试代码的函数
function generateTestCode(
  basicInfo: any,
  template: any,
  displayName: string
): string {
  const className = displayName.replace(/\s/g, "");

  return `import ${className.toLowerCase()}Instance, { ${className} } from '../src/index'

describe('${displayName}', () => {
  let plugin: ${className};

  beforeEach(() => {
    plugin = new ${className}()
  })

  it('should create plugin instance', () => {
    expect(plugin).toBeDefined()
    expect(plugin).toBeInstanceOf(${className})
  })

  it('should use exported instance', () => {
    expect(${className.toLowerCase()}Instance).toBeDefined()
    expect(${className.toLowerCase()}Instance).toBeInstanceOf(${className})
  })

  it('should execute successfully', async () => {
    const inputs = { test: 'data' }
    const context = {
      nodeId: 'test-node',
      workflowId: 'test-workflow',
      log: jest.fn()
    }

    const result = await plugin.execute(inputs, context)

    expect(result.success).toBe(true)
    expect(result.data).toBeDefined()
    expect((result.data as any).processed).toBe(true)
  })

  it('should handle errors gracefully', async () => {
    // 测试错误处理 - 模拟一个会抛出错误的情况
    const inputs = { test: 'data' }
    const context = {
      nodeId: 'test-node',
      workflowId: 'test-workflow',
      log: jest.fn(() => {
        throw new Error('Mock error for testing')
      })
    }

    const result = await plugin.execute(inputs, context)

    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
  })
})`;
}

// 生成automation配置的函数
function generateAutomationConfigs(
  basicInfo: any,
  template: any,
  domain: any,
  displayName: string,
  automationNodeType: string
): any {
  // 1. 生成 NODE_REGISTRY 条目
  const registry = {
    type: automationNodeType, // action.discord
    name: displayName,
    description: basicInfo.description,
    categoryId: template.category,
    subCategoryId: domain.value,
    icon: "icon.svg", // 插件内的图标文件路径
    tags: [basicInfo.name, template.category, domain.value, "automation"],
    isPopular: false,
  };

  // 2. 生成 PORT_CONFIGS 条目
  let ports = [];

  switch (template.value) {
    case "trigger":
      // Trigger节点只有输出 - 参考 trigger.webhook
      ports = [
        {
          id: "output",
          type: "output",
          label: "Event Data",
          allowMultiple: true,
        },
      ];
      break;

    case "action":
      // Action节点标准格式 - 参考 action.http_request
      ports = [
        {
          id: "input",
          type: "input",
          label: "Input",
          allowMultiple: false,
        },
        {
          id: "output",
          type: "output",
          label: "Response",
          allowMultiple: true,
        },
      ];
      break;

    case "transform":
      // Transform节点格式 - 参考 transform.formula
      ports = [
        {
          id: "input",
          type: "input",
          label: "Input",
          allowMultiple: false,
        },
        {
          id: "output",
          type: "output",
          label: "Result",
          allowMultiple: true,
        },
      ];
      break;

    case "control":
      // Control节点格式 - 参考 control.if
      ports = [
        {
          id: "input",
          type: "input",
          label: "Input",
          required: true,
          allowMultiple: false,
        },
        {
          id: "true",
          type: "output",
          label: "True",
          allowMultiple: true,
        },
        {
          id: "false",
          type: "output",
          label: "False",
          allowMultiple: true,
        },
      ];
      break;

    case "ai":
      // AI节点复杂格式 - 参考 ai.general
      ports = [
        {
          id: "input",
          type: "input",
          label: "Input",
          required: true,
          allowMultiple: false,
        },
        {
          id: "model",
          type: "output",
          label: "Model",
          role: "model",
          required: true,
          description: "AI model to use for processing",
          position: "bottom",
          allowMultiple: false,
        },
        {
          id: "output",
          type: "output",
          label: "Result",
          allowMultiple: true,
        },
      ];
      break;

    default:
      // 默认action格式
      ports = [
        {
          id: "input",
          type: "input",
          label: "Input",
          allowMultiple: false,
        },
        {
          id: "output",
          type: "output",
          label: "Output",
          allowMultiple: true,
        },
      ];
  }

  const portsConfig = {
    ports: ports,
  };

  // 3. 生成 TOOLBAR_CONFIGS 条目（可选）
  const toolbarConfig = {
    position: "top",
    buttons: ["run", "delete", "activate", "more"],
    showContent: true,
  };

  // 4. 生成 LAYOUT_CONFIGS 条目（可选）
  let layoutConfig = {
    width: 180,
    minHeight: 100,
    showContent: true,
  };

  // 根据节点类型调整默认尺寸
  switch (template.value) {
    case "trigger":
      layoutConfig = { width: 160, minHeight: 80, showContent: true };
      break;
    case "transform":
      layoutConfig = { width: 160, minHeight: 90, showContent: true };
      break;
    case "control":
      layoutConfig = { width: 140, minHeight: 100, showContent: true };
      break;
    case "ai":
      layoutConfig = { width: 240, minHeight: 120, showContent: true };
      break;
  }

  return {
    registry: registry,
    ports: portsConfig,
    toolbar: toolbarConfig,
    layout: layoutConfig,
  };
}

// 生成 Jest 配置的函数
function generateJestConfig(): string {
  return `module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/*.test.ts', '**/*.test.js'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: true }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!@choiceform)',
  ],
  moduleNameMapper: {
    '^@choiceform/automation-sdk$': '<rootDir>/tests/__mocks__/@choiceform/automation-sdk.ts',
  },
};`;
}

// 生成 Mock 文件的函数
function generateMockContent(): string {
  return `// Mock for @choiceform/automation-sdk
export interface PluginExecutionContext {
  nodeId: string;
  workflowId: string;
  log: (level: string, message: string, data?: any) => void;
}

export interface ExecutionResult {
  success: boolean;
  data?: any;
  error?: string;
}

export interface PluginManifest {
  name: string;
  version: string;
  description: string;
  author: string;
  nodeType: string;
  automationNodeType: string;
  displayName: string;
  category: string;
  domain: string;
  subCategory: string;
  icon: string;
  tags: string[];
  isPopular: boolean;
  sdkVersion: string;
  automationConfigs?: any;
  metadata?: any;
}

export interface PortConfig {
  ports: Array<{
    id: string;
    type: string;
    label: string;
    allowMultiple: boolean;
  }>;
}

export abstract class ActionNode {
  logger?: { info: (message: string) => void };

  abstract setup(): Promise<void>;
  abstract teardown(): Promise<void>;
  abstract getManifest(): PluginManifest;
  abstract getPortConfig(): PortConfig;
  abstract execute(inputs: Record<string, unknown>, context: PluginExecutionContext): Promise<ExecutionResult>;
}`;
}
