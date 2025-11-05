/**
 * CLI-Related Types
 */

import type { NodeCategory } from "./base";

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

