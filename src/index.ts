export * from "./types";
export * from "./base";
export * from "./utils";

// 注册表相关导出（避免类型冲突）
export {
  PluginRegistryImpl as PluginRegistry,
  globalPluginRegistry,
  registerPlugin,
  getPlugin,
  listPlugins,
  searchPlugins,
} from "./registry";

// 便捷导出
export { PluginBase, TriggerNode, ActionNode, TransformNode } from "./base";

export { createManifest, validatePlugin, buildPlugin } from "./utils";

// 类型导出
export type {
  PluginManifest,
  AutomationNodeConfigs,
  PluginExecutionContext,
  ExecutionResult,
  NodeCategory,
  NodeComplexity,
  BaseNodePort,
  ExtendedNodePort,
  NodePort,
  PortConfig,
  PortStyleConfig,
  PortShape,
  PortSize,
  PortRole,
  PortPosition,
  ToolbarConfig,
  ToolbarPosition,
  NodeToolbarButton,
  LayoutConfig,
  ParameterDisplayType,
  NodeParameterPreview,
  EditorConfig,
  NodeConfig,
  NodeTypeConfigs,
  ConfigKey,
  PluginNodeType,
  BuiltinNodeType,
  NodeType,
  NodesConfigData,
  NodeRegistryItem,
  PluginNodeRegistryItem,
  BuiltinNodeRegistryItem,
  BuiltinNodeRegistryBase,
  NodeRegistryItemBase,
  CategoryInfo,
  SubCategoryInfo,
  NodePosition,
  NodeSize,
  // 配置相关类型
  FieldType,
  ConfigField,
  SelectOption,
  NodeConfigSchema,
} from "./types";
