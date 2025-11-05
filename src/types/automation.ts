/**
 * Automation Config Types
 */

import type { ExtendedConfigSchema } from "./config";
import type { LayoutConfig } from "./layout";
import type { PortConfig } from "./port";
import type { NodeRegistryItem } from "./registry";
import type { ToolbarConfig } from "./toolbar";

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
  configSchema?: ExtendedConfigSchema;
  // TOOLBAR_CONFIGS条目
  toolbar?: ToolbarConfig; // 可选，使用默认配置
  // LAYOUT_CONFIGS条目
  layout?: LayoutConfig; // 可选，使用默认配置
}
