/**
 * Unified Node Config Types
 */

import type { NodeCategory } from "./base";
import type { EditorConfig } from "./layout";
import type { LayoutConfig } from "./layout";
import type { PortConfig } from "./port";
import type { CategoryInfo, NodeRegistryItem } from "./registry";
import type { ToolbarConfig } from "./toolbar";

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
type BuiltinNodeType = string; // 在SDK中简化为string，实际使用时由automation系统定义具体类型
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
  nodes: Array<NodeRegistryItem>;
}
