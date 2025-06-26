import type { PluginManifest, NodeConfig, PortDefinition, NodeCategory, IconName } from '../types'

/**
 * 验证 Plugin Manifest
 */
export function validateManifest(manifest: PluginManifest): string[] {
  const errors: string[] = []

  if (!manifest.name || manifest.name.trim() === '') {
    errors.push('Plugin name is required')
  }

  if (!manifest.version || !/^\d+\.\d+\.\d+/.test(manifest.version)) {
    errors.push('Valid semantic version is required')
  }

  if (!manifest.nodeType || manifest.nodeType.trim() === '') {
    errors.push('Node type is required')
  }

  if (!manifest.displayName || manifest.displayName.trim() === '') {
    errors.push('Display name is required')
  }

  if (!manifest.description || manifest.description.trim() === '') {
    errors.push('Description is required')
  }

  if (!manifest.author || manifest.author.trim() === '') {
    errors.push('Author is required')
  }

  if (!['trigger', 'action', 'transform', 'control', 'ai', 'utility'].includes(manifest.category)) {
    errors.push('Invalid category')
  }

  if (!manifest.sdkVersion || manifest.sdkVersion.trim() === '') {
    errors.push('SDK version is required')
  }

  return errors
}

/**
 * 验证 Node Config
 */
export function validateNodeConfig(config: NodeConfig): string[] {
  const errors: string[] = []

  if (!Array.isArray(config.ports)) {
    errors.push('Ports must be an array')
    return errors
  }

  const portIds = new Set<string>()
  for (const port of config.ports) {
    if (!port.id || port.id.trim() === '') {
      errors.push('Port ID is required')
      continue
    }

    if (portIds.has(port.id)) {
      errors.push(`Duplicate port ID: ${port.id}`)
    }
    portIds.add(port.id)

    if (!['input', 'output'].includes(port.type)) {
      errors.push(`Invalid port type for ${port.id}: ${port.type}`)
    }
  }

  return errors
}

/**
 * 生成默认的 Plugin Manifest
 */
export function createDefaultManifest(options: {
  author: string,
  category?: string,
  description?: string
  name: string
}): PluginManifest {
  const { name, author, description = '', category = 'action' } = options
  
  return {
    name,
    version: '1.0.0',
    description,
    author,
    nodeType: `${name.toLowerCase().replace(/\s+/g, '-')}.${category}`,
    displayName: name,
    category: category as NodeCategory,
    icon: 'icon-action-code-block' as IconName,
    tags: [category],
    complexity: 'beginner',
    isPopular: false,
    sdkVersion: '^1.0.0',
    metadata: {
      createdAt: new Date().toISOString()
    }
  }
}

/**
 * 生成默认的 Node Config
 */
export function createDefaultNodeConfig(category: string): NodeConfig {
  const basePorts: PortDefinition[] = []

  // 根据分类添加默认端口
  if (category === 'trigger') {
    basePorts.push({
      id: 'output',
      type: 'output' as const,
      label: 'Output',
      dataType: 'object' as const
    })
  } else {
    basePorts.push(
      {
        id: 'input',
        type: 'input' as const,
        label: 'Input',
        dataType: 'object' as const,
        required: true
      },
      {
        id: 'output',
        type: 'output' as const,
        label: 'Output',
        dataType: 'object' as const
      }
    )
  }

  return {
    ports: basePorts,
    ui: {
      width: 240,
      height: 80,
      showContent: true
    }
  }
}

/**
 * 格式化插件名称为合法的文件名
 */
export function sanitizePluginName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * 生成插件目录名
 */
export function generatePluginDirectoryName(name: string, category: string): string {
  const sanitized = sanitizePluginName(name)
  return `${sanitized}-${category}`
} 