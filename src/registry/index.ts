import type { IPlugin, PluginManifest } from '../types'

// 定义本地接口避免类型冲突
interface IPluginRegistry {
  get(nodeType: string): IPlugin | undefined,
  list(): PluginManifest[],
  plugins: Map<string, IPlugin>,
  register(plugin: IPlugin): void,
  search(query: string): PluginManifest[],
  unregister(nodeType: string): void
}

/**
 * Plugin 注册表实现
 */
export class PluginRegistryImpl implements IPluginRegistry {
  public plugins = new Map<string, IPlugin>()

  register(plugin: IPlugin): void {
    const manifest = plugin.getManifest()
    const nodeType = manifest.nodeType
    
    if (this.plugins.has(nodeType)) {
      console.warn(`Plugin ${nodeType} already registered, replacing...`)
    }
    
    this.plugins.set(nodeType, plugin)
    console.log(`Plugin registered: ${nodeType}`)
  }

  unregister(nodeType: string): void {
    if (this.plugins.has(nodeType)) {
      this.plugins.delete(nodeType)
      console.log(`Plugin unregistered: ${nodeType}`)
    }
  }

  get(nodeType: string): IPlugin | undefined {
    return this.plugins.get(nodeType)
  }

  list(): PluginManifest[] {
    return Array.from(this.plugins.values()).map(plugin => plugin.getManifest())
  }

  search(query: string): PluginManifest[] {
    const lowerQuery = query.toLowerCase()
    return this.list().filter(manifest => 
      manifest.displayName.toLowerCase().includes(lowerQuery) ||
      manifest.description.toLowerCase().includes(lowerQuery) ||
      manifest.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }

  // 按分类获取
  getByCategory(category: string): PluginManifest[] {
    return this.list().filter(manifest => manifest.category === category)
  }

  // 获取热门插件
  getPopular(): PluginManifest[] {
    return this.list().filter(manifest => manifest.isPopular)
  }

  // 清空所有插件
  clear(): void {
    this.plugins.clear()
  }
}

// 全局注册表单例
export const globalPluginRegistry = new PluginRegistryImpl()

// 便捷函数
export function registerPlugin(plugin: IPlugin): void {
  globalPluginRegistry.register(plugin)
}

export function getPlugin(nodeType: string): IPlugin | undefined {
  return globalPluginRegistry.get(nodeType)
}

export function listPlugins(): PluginManifest[] {
  return globalPluginRegistry.list()
}

export function searchPlugins(query: string): PluginManifest[] {
  return globalPluginRegistry.search(query)
} 