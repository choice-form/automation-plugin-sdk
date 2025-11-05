/**
 * Toolbar-Related Types
 */

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
