/**
 * Automation Plugin SDK Types
 *
 * 完全匹配 automation/packages/client/app/contents/nodes-config 的数据结构
 */

// ===== 配置字段类型 =====

/**
 * 基础字段类型
 */
export type FieldType = "string" | "number" | "boolean" | "select" | "date";

/**
 * 选择器选项
 */
export interface SelectOption {
  label: string;
  value: string | number;
  description?: string;
}

/**
 * 基础配置字段定义
 */
export interface ConfigField {
  /** 字段唯一标识 */
  key: string;
  /** 字段类型 */
  type: FieldType;
  /** 显示标签 */
  label: string;
  /** 字段描述 */
  description?: string;
  /** 是否必填 */
  required?: boolean;
  /** 默认值 */
  defaultValue?: unknown;
  /** 占位符文本 */
  placeholder?: string;
  /** 是否支持表达式 */
  supportExpression?: boolean;
  /** 是否敏感信息（如密码、token） */
  sensitive?: boolean;
  /** select类型的选项 */
  options?: SelectOption[];
  /** 字段验证规则 */
  validation?: {
    /** 最小值/最小长度 */
    min?: number;
    /** 最大值/最大长度 */
    max?: number;
    /** 正则表达式验证 */
    pattern?: string;
    /** 自定义验证错误信息 */
    message?: string;
  };
  /** UI提示 */
  ui?: {
    /** 是否多行文本 */
    multiline?: boolean;
    /** 输入框宽度 */
    width?: "small" | "medium" | "large" | "full";
    /** 字段分组 */
    group?: string;
    /** 显示顺序 */
    order?: number;
    /** 是否隐藏（条件显示） */
    hidden?: boolean;
  };
}

/**
 * 节点配置模式
 */
export interface NodeConfigSchema {
  /** 配置字段列表 */
  fields: ConfigField[];
  /** 配置分组 */
  groups?: {
    [groupName: string]: {
      label: string;
      description?: string;
      collapsed?: boolean;
    };
  };
}

// ===== 基础类型 =====

/**
 * 节点类别 - 与automation保持一致
 */
export type NodeCategory =
  | "trigger"
  | "action"
  | "transform"
  | "control"
  | "ai"
  | "utility";

/**
 * 节点复杂度
 */
export type NodeComplexity = "beginner" | "intermediate" | "advanced";

// ===== 端口相关类型 =====

/**
 * 端口位置
 */
export type PortPosition = "left" | "right" | "top" | "bottom";

/**
 * 端口角色类型 - 用于 AI 节点等复杂场景
 */
export type PortRole =
  | "model" // AI 模型端口
  | "memory" // 内存/上下文端口
  | "tool" // 工具端口
  | "data" // 普通数据端口
  | "trigger" // 触发端口
  | "control" // 控制端口
  | "config"; // 配置端口

/**
 * 基础端口定义 - 完全匹配automation格式
 */
export interface BaseNodePort {
  id: string;
  type: "input" | "output";
  label?: string;
  allowMultiple?: boolean;
  required?: boolean;
  dataType?: string;
  position?: PortPosition;
  role?: PortRole;
  description?: string;
  group?: string;
  order?: number;
  placeholder?: string;
  defaultValue?: unknown;
}

/**
 * 端口配置 - 匹配PORT_CONFIGS格式
 */
export interface PortConfig {
  ports: BaseNodePort[];
  styles?: Record<string, any>;
}

// ===== 工具栏相关类型 =====

/**
 * 工具栏按钮类型 - 匹配automation格式
 */
export type NodeToolbarButton = "run" | "delete" | "activate" | "more";

/**
 * 工具栏位置
 */
export type ToolbarPosition = "top" | "bottom";

/**
 * 工具栏配置 - 匹配TOOLBAR_CONFIGS格式
 */
export interface ToolbarConfig {
  position: ToolbarPosition;
  buttons: readonly NodeToolbarButton[];
  showContent: boolean;
}

// ===== 布局相关类型 =====

/**
 * 布局配置 - 匹配LAYOUT_CONFIGS格式
 */
export interface LayoutConfig {
  width: number;
  minHeight: number;
  showContent: boolean;
}

// ===== 节点注册表类型 =====

/**
 * 节点注册信息 - 匹配NODE_REGISTRY格式
 */
export interface NodeRegistryItem {
  type: string; // 格式：category.name (如 action.discord)
  name: string;
  description: string;
  categoryId: NodeCategory;
  subCategoryId?: string;
  icon: string; // 插件内的图标文件路径，如 "icon.svg" 或 "icon.png"
  tags: string[];
  isPopular: boolean;
}

// ===== Automation配置类型 =====

/**
 * Automation节点完整配置
 * 这是automation系统需要的完整配置格式
 */
export interface AutomationNodeConfigs {
  // NODE_REGISTRY条目
  registry: NodeRegistryItem;
  // PORT_CONFIGS条目
  ports: PortConfig;
  // CONFIG_SCHEMA条目 - 用户配置字段定义
  configSchema?: NodeConfigSchema;
  // TOOLBAR_CONFIGS条目
  toolbar?: ToolbarConfig; // 可选，使用默认配置
  // LAYOUT_CONFIGS条目
  layout?: LayoutConfig; // 可选，使用默认配置
}

// ===== 插件相关类型 =====

/**
 * 插件执行上下文
 */
export interface PluginExecutionContext {
  nodeId: string;
  workflowId: string;
  userId?: string;
  log: (
    level: "debug" | "info" | "warn" | "error",
    message: string,
    data?: unknown
  ) => void;
}

/**
 * 插件执行结果
 */
export interface ExecutionResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

/**
 * 插件清单文件
 */
export interface PluginManifest {
  name: string; // @choiceform/plugin-name
  version: string;
  description: string;
  author: string;

  // 节点标识
  nodeType: string; // @choiceform/plugin-name.category (插件格式)
  automationNodeType: string; // category.name (automation格式)

  displayName: string;
  category: string;
  domain: string;
  subCategory: string;
  icon: string; // 插件内的图标文件名，如 "icon.svg"
  tags: string[];
  isPopular: boolean;
  sdkVersion: string;

  // automation系统配置
  automationConfigs: AutomationNodeConfigs;

  metadata: {
    createdAt: string;
    updatedAt: string;
  };
}

/**
 * 插件注册表文件
 */
export interface PluginRegistry {
  name: string;
  version: string;
  author: string;
  submittedAt: string;
  category: string;
  domain: string;
  security: {
    level: string;
    permissions: string[];
    sandbox: boolean;
    description: string;
  };
  testing: {
    coverage: number;
    testFiles: string[];
    integrationTests: boolean;
    performanceTests: boolean;
  };
  compatibility: {
    sdkVersion: string;
    nodeVersion: string;
    platformVersion: string;
  };
}

// ===== CLI相关类型 =====

/**
 * 创建插件的选项
 */
export interface CreatePluginOptions {
  name: string;
  author: string;
  description: string;
  template: string;
  domain: string;
  includeTests: boolean;
  strictMode: boolean;
  outputDir?: string;
}

/**
 * 插件模板配置
 */
export interface PluginTemplate {
  name: string;
  value: string;
  baseClass: string;
  category: NodeCategory;
  description: string;
}
