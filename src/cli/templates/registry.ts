import type { PluginTemplate } from "../../types/cli";

/**
 * 插件模板注册表
 */
export const TEMPLATE_REGISTRY: Record<string, PluginTemplate> = {
  "webhook-trigger": {
    name: "🎯 Trigger - Listen for events (webhooks, schedules, etc.)",
    value: "trigger",
    baseClass: "TriggerNode",
    category: "trigger",
    description: "Create trigger nodes that listen for external events",
  },
  "http-action": {
    name: "⚡ Action - Perform operations (API calls, notifications, etc.)",
    value: "action",
    baseClass: "ActionNode",
    category: "action",
    description: "Create action nodes that perform operations",
  },
  "data-transform": {
    name: "🔄 Transform - Process and modify data",
    value: "transform",
    baseClass: "TransformNode",
    category: "transform",
    description: "Create transform nodes that process data",
  },
  "ai-processor": {
    name: "🤖 AI - AI-powered processing (text, image, etc.)",
    value: "ai",
    baseClass: "AINode",
    category: "ai",
    description: "Create AI-powered processing nodes",
  },
  "flow-control": {
    name: "🔀 Control - Flow control (conditions, loops, etc.)",
    value: "control",
    baseClass: "ControlNode",
    category: "control",
    description: "Create control flow nodes",
  },
  generic: {
    name: "Generic Plugin - Start from scratch",
    value: "generic",
    baseClass: "PluginBase",
    category: "action",
    description: "Start with a basic plugin template",
  },
};
