/**
 * Plugin-Related Types
 */

import type { AutomationNodeConfigs } from "./automation";
import type { ExtendedConfigSchema } from "./config";
import type { LayoutConfig } from "./layout";
import type { NodePort } from "./port";
import type { PluginNodeRegistryItem } from "./registry";

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
  tags: Array<string>;
  isPopular: boolean;
  sdkVersion: string;

  // automation系统配置
  automationConfigs: AutomationNodeConfigs;

  metadata: {
    createdAt: string;
    updatedAt: string;
  };
  keywords?: Array<string>;
  main: string;
  types?: string;
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
    permissions: Array<string>;
    sandbox: boolean;
    description: string;
  };
  testing: {
    coverage: number;
    testFiles: Array<string>;
    integrationTests: boolean;
    performanceTests: boolean;
  };
  compatibility: {
    sdkVersion: string;
    nodeVersion: string;
    platformVersion: string;
  };
}

export interface PluginInstallStatus {
  error?: string;
  progress: number;
  startTime?: number;
  status:
    | "idle"
    | "downloading"
    | "extracting"
    | "installing"
    | "uninstalling"
    | "completed"
    | "error";
}

export interface UnifiedPluginData {
  author: string;
  automationConfigs?: {
    configSchema?: ExtendedConfigSchema;
    editor?: {
      panes?: {
        center?: boolean;
        left?: boolean;
        right?: boolean;
      };
    };
    layout?: LayoutConfig;
    ports?: {
      inputPorts: Array<NodePort>;
      outputPorts: Array<NodePort>;
    };
    registry?: PluginNodeRegistryItem;
    toolbar?: {
      buttons: Array<string>;
      position: string;
      showContent: boolean;
    };
  };
  availableVersion?: string;
  category: "tools" | "extensions" | "models";
  configSchema?: ExtendedConfigSchema;
  description: string;
  downloadUrl: string;
  errorMessage?: string;
  hasUpdate: boolean;
  iconData?: string;
  iconType?: "svg" | "png" | "jpg" | "jpeg";
  id: string;
  installStatus: PluginInstallStatus;
  installedAt: number;
  lastCheckTime?: number;
  manifest: PluginManifest;
  name: string;
  status: "active" | "disabled" | "error";
  version: string;
}
