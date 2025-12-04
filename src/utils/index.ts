import type { PluginManifest } from "../types/plugin";
import type { AutomationNodeConfigs } from "../types/automation";

/**
 * 创建插件清单文件
 */
export function createManifest(options: {
  name: string;
  version: string;
  description: string;
  author: string;
  nodeType: string;
  automationNodeType: string;
  displayName: string;
  category: string;
  domain: string;
  subCategory: string;
  icon: string;
  tags: string[];
  isPopular: boolean;
  sdkVersion: string;
  automationConfigs: AutomationNodeConfigs;
  main: string;
}): PluginManifest {
  return {
    name: options.name,
    version: options.version,
    description: options.description,
    author: options.author,
    nodeType: options.nodeType,
    automationNodeType: options.automationNodeType,
    displayName: options.displayName,
    category: options.category,
    domain: options.domain,
    subCategory: options.subCategory,
    icon: options.icon,
    tags: options.tags,
    isPopular: options.isPopular,
    main: options.main,
    sdkVersion: options.sdkVersion,
    automationConfigs: options.automationConfigs,
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };
}

/**
 * 验证插件配置
 */
export function validatePlugin(manifest: PluginManifest): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // 基础字段验证
  if (!manifest.name) errors.push("name is required");
  if (!manifest.version) errors.push("version is required");
  if (!manifest.description) errors.push("description is required");
  if (!manifest.author) errors.push("author is required");
  if (!manifest.nodeType) errors.push("nodeType is required");
  if (!manifest.automationNodeType)
    errors.push("automationNodeType is required");

  // 端口配置验证
  if (!manifest.automationConfigs?.ports) {
    errors.push("ports configuration is required");
  } else {
    const inputPorts = manifest.automationConfigs.ports.inputPorts;
    const outputPorts = manifest.automationConfigs.ports.outputPorts;
    const ports = [...inputPorts, ...outputPorts];

    if (inputPorts.length === 0 && outputPorts.length === 0) {
      errors.push("at least one input or output port is required");
    }

    // 验证端口ID唯一性
    const portIds = ports.map((p) => p.id);
    const uniqueIds = new Set(portIds);
    if (portIds.length !== uniqueIds.size) {
      errors.push("port IDs must be unique");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 构建插件
 */
export function buildPlugin(manifest: PluginManifest): {
  success: boolean;
  message: string;
} {
  const validation = validatePlugin(manifest);

  if (!validation.valid) {
    return {
      success: false,
      message: `Validation failed: ${validation.errors.join(", ")}`,
    };
  }

  return {
    success: true,
    message: "Plugin built successfully",
  };
}

/**
 * 验证插件清单
 */
export function validateManifest(manifest: PluginManifest): string[] {
  const errors: string[] = [];

  if (!manifest.name || manifest.name.trim() === "") {
    errors.push("Plugin name is required");
  }

  if (!manifest.version || !/^\d+\.\d+\.\d+/.test(manifest.version)) {
    errors.push("Valid semantic version is required");
  }

  if (!manifest.nodeType || manifest.nodeType.trim() === "") {
    errors.push("Node type is required");
  }

  if (
    !manifest.automationNodeType ||
    manifest.automationNodeType.trim() === ""
  ) {
    errors.push("Automation node type is required");
  }

  if (!manifest.displayName || manifest.displayName.trim() === "") {
    errors.push("Display name is required");
  }

  if (!manifest.description || manifest.description.trim() === "") {
    errors.push("Description is required");
  }

  if (!manifest.author || manifest.author.trim() === "") {
    errors.push("Author is required");
  }

  if (
    !["trigger", "action", "transform", "control", "ai", "utility"].includes(
      manifest.category
    )
  ) {
    errors.push("Invalid category");
  }

  if (!manifest.sdkVersion || manifest.sdkVersion.trim() === "") {
    errors.push("SDK version is required");
  }

  return errors;
}

/**
 * 格式化插件名称为合法的文件名
 */
export function sanitizePluginName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * 生成插件目录名
 */
export function generatePluginDirectoryName(
  name: string,
  category: string
): string {
  const sanitized = sanitizePluginName(name);
  return `${sanitized}-${category}`;
}
