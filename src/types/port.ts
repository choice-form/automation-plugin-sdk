/**
 * Port-Related Types
 */

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
 * 基础端口定义
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
  ports: Array<NodePort>;
  styles?: Record<string, PortStyleConfig>;
}
