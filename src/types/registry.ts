/**
 * Node Registry Types
 */

import type { NodeCategory } from "./base";
import type { PluginI18nText } from "./i18n-text";

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
  tags: Array<string>;
  /**
   * agent 用到的 tool 节点需要有唯一的 name 来标识
   */
  toolUniqName?: string;
  /**
   * 注意这个 typeVersion 是用来做参数兼容的，
   * 如果某个节点的参数改动对执行逻辑有大的影响，
   * 需要做一个新的节点（拿代码节点做例子，新加一个节点 type: "action.code.v2" 和现有的节点 type: "action.code" 并存）
   */
  typeVersion: number | undefined;
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
type BuiltinNodeRegistryItem = BuiltinNodeRegistryBase & {
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
  subCategories?: Array<SubCategoryInfo>;
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
