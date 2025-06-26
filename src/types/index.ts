/**
 * Plugin SDK Types
 * 参考 automation nodes-config 的结构设计
 */

// 临时使用 string 类型，后续替换为实际的 IconName 类型
export type IconName = string

// ===== 基础类型 =====

export type NodeCategory = "trigger" | "action" | "transform" | "control" | "ai" | "utility"
export type NodeComplexity = "beginner" | "intermediate" | "advanced"

// ===== Plugin 元数据 =====

export interface PluginManifest {
  author: string,
  category: NodeCategory,
  complexity: NodeComplexity,
  description: string,
  // 如 "webhook.trigger"
  displayName: string,
  homepage?: string,
  icon: IconName,
  
  isPopular?: boolean, 
  license?: string,
  // 元数据
  metadata?: {
    createdAt: string
    deprecated?: boolean,
    replacedBy?: string,
    updatedAt?: string
  },
  minAutomationVersion?: string,
  name: string,
  // Node 基础信息
  nodeType: string,
  // 权限声明
  permissions?: string[],
  repository?: string,
  
  // SDK 兼容性
  sdkVersion: string
  subCategory?: string,
  
  tags: string[],
  
  version: string
}

// ===== 端口定义 =====

export type PortType = "input" | "output"
export type PortDataType = "string" | "number" | "boolean" | "object" | "array" | "any"

export interface PortDefinition {
  allowMultiple?: boolean,
  dataType?: PortDataType,
  defaultValue?: unknown,
  description?: string
  group?: string,
  id: string,
  label?: string,
  order?: number,
  required?: boolean,
  type: PortType
}

// ===== Node 配置 =====

export interface NodeConfig {
  ports: PortDefinition[]
  settings?: Record<string, unknown>
  ui?: {
    color?: string,
    height?: number
    showContent?: boolean,
    width?: number
  }
}

// ===== 执行上下文 =====

export interface PluginExecutionContext {
  createError: (message: string, code?: string) => Error,
  environment: 'development' | 'production' | 'test',
  executionId: string,
  getCache: (key: string) => Promise<unknown | null>,
  // 数据访问
  getSecret: (key: string) => Promise<string | null>,
  
  // 工具函数
  log: (level: 'info' | 'warn' | 'error', message: string, data?: unknown) => void
  nodeId: string,
  
  setCache: (key: string, value: unknown, ttl?: number) => Promise<void>,
  userId: string,
  workflowId: string
}

// ===== 执行结果 =====

export interface ExecutionResult {
  data?: Record<string, unknown>,
  error?: string,
  metadata?: {
    [key: string]: unknown,
    executionTime?: number,
    memoryUsage?: number
  },
  success: boolean
}

// ===== Plugin 接口 =====

export interface IPlugin {
  execute(inputs: Record<string, unknown>, context: PluginExecutionContext): Promise<ExecutionResult>,
  getManifest(): PluginManifest,
  getNodeConfig(): NodeConfig,
  onInstall?(): Promise<void>,
  onUninstall?(): Promise<void>,
  validate?(inputs: Record<string, unknown>): Promise<boolean>
}

// ===== Plugin 注册 =====

export interface PluginRegistry {
  get(nodeType: string): IPlugin | undefined,
  list(): PluginManifest[],
  plugins: Map<string, IPlugin>,
  register(plugin: IPlugin): void,
  search(query: string): PluginManifest[],
  unregister(nodeType: string): void
}

// ===== CLI 相关类型 =====

export interface TemplateConfig {
  category: NodeCategory,
  description: string
  files: Record<string, string>,
  name: string,
  ports: PortDefinition[] // 文件路径 -> 模板内容
}

export interface CreatePluginOptions {
  author?: string,
  category?: NodeCategory,
  description?: string,
  name: string,
  outputDir?: string,
  template: string
} 