/**
 * Basic Types
 */

/**
 * 节点类别 - 与automation保持一致
 */
export type NodeCategory =
  | "trigger"
  | "action"
  | "transform"
  | "control"
  | "ai"
  | "utility"
  | "ai_tool"
  | "ai_memory";

/**
 * 节点复杂度
 */
export type NodeComplexity = "beginner" | "intermediate" | "advanced";

/**
 * 节点位置信息
 */
export interface NodePosition {
  x: number;
  y: number;
}

/**
 * 节点尺寸信息
 */
export interface NodeSize {
  height: number;
  width: number;
}
