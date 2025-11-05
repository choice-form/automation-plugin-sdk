export * from "./base";
export * from "./utils";

export * from "./types/automation";
export * from "./types/base";
export * from "./types/cli";
export * from "./types/config";
export * from "./types/i18n-text";
export * from "./types/layout";
export * from "./types/node";
export * from "./types/plugin";
export * from "./types/port";
export * from "./types/registry";
export * from "./types/toolbar";

// 注册表相关导出（避免类型冲突）
export {
  PluginRegistryImpl as PluginRegistry,
  globalPluginRegistry,
  registerPlugin,
  getPlugin,
  listPlugins,
  searchPlugins,
} from "./registry";

export { createManifest, validatePlugin, buildPlugin } from "./utils";
