import type { PluginManifest } from "../types/plugin";

/**
 * 插件注册表实现
 */
export class PluginRegistryImpl {
  private plugins: Map<string, PluginManifest> = new Map();

  register(manifest: PluginManifest): void {
    this.plugins.set(manifest.automationNodeType, manifest);
  }

  unregister(nodeType: string): void {
    this.plugins.delete(nodeType);
  }

  get(nodeType: string): PluginManifest | undefined {
    return this.plugins.get(nodeType);
  }

  list(): PluginManifest[] {
    return Array.from(this.plugins.values());
  }

  search(query: string): PluginManifest[] {
    const lowerQuery = query.toLowerCase();
    return this.list().filter(
      (manifest) =>
        manifest.name.toLowerCase().includes(lowerQuery) ||
        manifest.description.toLowerCase().includes(lowerQuery) ||
        manifest.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  }

  clear(): void {
    this.plugins.clear();
  }
}

/**
 * 全局插件注册表实例
 */
export const globalPluginRegistry = new PluginRegistryImpl();

/**
 * 注册插件
 */
export function registerPlugin(manifest: PluginManifest): void {
  globalPluginRegistry.register(manifest);
}

/**
 * 获取插件
 */
export function getPlugin(nodeType: string): PluginManifest | undefined {
  return globalPluginRegistry.get(nodeType);
}

/**
 * 列出所有插件
 */
export function listPlugins(): PluginManifest[] {
  return globalPluginRegistry.list();
}

/**
 * 搜索插件
 */
export function searchPlugins(query: string): PluginManifest[] {
  return globalPluginRegistry.search(query);
}
