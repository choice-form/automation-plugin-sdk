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
  | "utility"
  | "ai_tool";

/**
 * 节点复杂度
 */
export type NodeComplexity = "beginner" | "intermediate" | "advanced";

/**
 * 节点位置信息
 */
export interface NodePosition {
  x: number;
  y: number;
}

/**
 * 节点尺寸信息
 */
export interface NodeSize {
  height: number;
  width: number;
}

// ===== 端口相关类型 =====

/**
 * 端口角色类型 - 用于 AI 节点等复杂场景
 */
export type PortRole =
  | "loopstart" // 循环开始端口
  | "memory" // 内存/上下文端口
  | "model" // AI 模型端口
  | "tool"; // 工具端口

/**
 * 端口位置
 */
export type PortPosition = "left" | "right" | "top" | "bottom";

/**
 * 端口形状
 */
export type PortShape = "circle" | "square" | "diamond" | "strip";

/**
 * 端口大小
 */
export type PortSize = "small" | "medium" | "large";

/**
 * 端口样式配置
 */
export interface PortStyleConfig {
  color?: string;
  icon?: string;
  label?: string;
  shape?: PortShape;
  size?: PortSize;
}

/**
 * 基础端口定义 - 完全匹配automation格式
 */
export interface BaseNodePort {
  allowMultiple?: boolean;
  dataType?: string;
  id: number;
  label?: string;
  position?: PortPosition;
  required?: boolean;
  role?: PortRole;
  style?: PortStyleConfig;
  type: "input" | "output";
}

/**
 * 扩展端口定义
 */
export interface ExtendedNodePort extends BaseNodePort {
  defaultValue?: unknown;
  description?: string;
  group?: string;
  order?: number;
  placeholder?: string;
}

/**
 * 统一端口类型
 */
export type NodePort = BaseNodePort | ExtendedNodePort;

/**
 * 端口配置 - 匹配PORT_CONFIGS格式
 */
export interface PortConfig {
  ports: NodePort[];
  styles?: Record<string, PortStyleConfig>;
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
  buttons: readonly NodeToolbarButton[];
  position: ToolbarPosition;
  showContent: boolean;
}

// ===== 布局相关类型 =====

/**
 * 参数展示类型
 */
export type ParameterDisplayType =
  | "string" // 默认字符串
  | "expression" // 表达式（显示为代码）
  | "array" // 数组（显示元素数量）
  | "percentage" // 百分比
  | "badge" // 标签样式
  | "boolean" // 布尔值（是/否）
  | "number" // 数字
  | "date" // 日期
  | "json"; // JSON 对象

/**
 * 节点参数预览配置
 */
export type NodeParameterPreview = {
  enabled?: boolean;
  /**
   * 如果参数值为空(空值或空数组或空对象)，则隐藏该参数的预览
   */
  hideParameterIfEmpty?: boolean;
  maxCharacters?: number;
  parameters?: Array<{
    displayType?: ParameterDisplayType;
    format?: string | ((value: unknown) => string | undefined); // 自定义格式化函数或模板
    key: string;
    label?: string;
  }>;
};

/**
 * 布局配置 - 匹配LAYOUT_CONFIGS格式
 */
export interface LayoutConfig {
  minHeight: number;
  parameterPreview?: NodeParameterPreview;
  showContent: boolean;
  width: number;
}

/**
 * 编辑器配置
 */
export interface EditorConfig {
  panes?: {
    center?: boolean;
    left?: boolean;
    right?: boolean;
  };
}

// ===== 节点注册表类型 =====

/**
 * 节点注册信息
 * 分成插件节点和内置节点两种，靠 builtinOrPlugin 字段区分
 */
export type NodeRegistryItem = PluginNodeRegistryItem | BuiltinNodeRegistryItem;

export interface NodeRegistryItemBase {
  categoryId: NodeCategory;
  description: string;
  docsUrl?: string;
  icon: string;
  /** How many nodes of that type can be created in a workflow */
  maxNodes?: number;
  name: string;
  tags: string[];
  /**
   * agent 用到的 tool 节点需要有唯一的 name 来标识
   */
  toolUniqName?: string;
}

/**
 * 插件节点注册信息
 */
export interface PluginNodeRegistryItem extends NodeRegistryItemBase {
  builtinOrPlugin: "plugin";
  isPopular: boolean;
  repository_url?: string;
  subCategoryId?: string;
  type: string;
}

export interface BuiltinNodeRegistryBase extends NodeRegistryItemBase {
  builtinOrPlugin: "builtin";
  subCategoryId?: string;
}

/**
 * 内置节点注册信息
 * 注：SDK中不包含具体的内置节点类型定义，实际使用时需要根据automation系统的类型定义
 */
export type BuiltinNodeRegistryItem = BuiltinNodeRegistryBase & {
  type: string; // 具体类型由automation系统定义，如 "action.http_request"
};

/**
 * 分类信息
 */
export interface CategoryInfo {
  color: string;
  description: string;
  icon: string; // IconName类型在SDK中简化为string
  id: NodeCategory;
  label: string;
  order: number;
  subCategories?: SubCategoryInfo[];
}

/**
 * 子分类信息
 */
export interface SubCategoryInfo {
  color: string;
  description: string;
  icon: string; // IconName类型在SDK中简化为string
  id: string;
  label: string;
  nodeCount: number;
}

// ===== 统一节点配置类型 =====

/**
 * 完整的节点配置
 * 这是我们新的统一配置接口
 */
export interface NodeConfig {
  // 编辑器配置
  editor: EditorConfig;
  // 布局配置
  layout: LayoutConfig;
  // 端口配置
  ports: PortConfig;
  // 基础注册信息
  registry: NodeRegistryItem;
  // 工具栏配置
  toolbar: ToolbarConfig;
}

/**
 * 节点类型配置映射
 */
export type NodeTypeConfigs = Record<string, Partial<NodeConfig>>;

/**
 * 配置键类型 - 用于部分配置获取
 */
export type ConfigKey = keyof NodeConfig;

/** 插件节点类型 即 string */
export type PluginNodeType = string;
/** 内置节点类型 */
export type BuiltinNodeType = string; // 在SDK中简化为string，实际使用时由automation系统定义具体类型
/** 节点类型 */
export type NodeType = PluginNodeType | BuiltinNodeType;

/**
 * 搜索用的节点配置数据
 */
export interface NodesConfigData {
  categories: Array<CategoryInfo & { id: NodeCategory }>;
  metadata?: {
    timestamp: string;
    version: string;
  };
  nodes: NodeRegistryItem[];
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
