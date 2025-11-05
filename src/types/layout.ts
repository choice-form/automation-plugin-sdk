/**
 * Layout-Related Types
 */

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

