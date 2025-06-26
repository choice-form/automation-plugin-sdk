import type { 
  IPlugin, 
  PluginManifest, 
  NodeConfig, 
  PluginExecutionContext, 
  ExecutionResult,
  NodeCategory 
} from '../types'

/**
 * Plugin 基础抽象类
 */
export abstract class PluginBase implements IPlugin {
  protected manifest: PluginManifest
  protected nodeConfig: NodeConfig

  constructor(manifest: PluginManifest, nodeConfig: NodeConfig) {
    this.manifest = manifest
    this.nodeConfig = nodeConfig
  }

  getManifest(): PluginManifest {
    return this.manifest
  }

  getNodeConfig(): NodeConfig {
    return this.nodeConfig
  }

  abstract execute(inputs: Record<string, unknown>, context: PluginExecutionContext): Promise<ExecutionResult>

  async validate(inputs: Record<string, unknown>): Promise<boolean> {
    // 默认验证：检查必需的输入端口
    const requiredPorts = this.nodeConfig.ports
      .filter(port => port.type === 'input' && port.required)
    
    for (const port of requiredPorts) {
      if (!(port.id in inputs)) {
        return false
      }
    }
    
    return true
  }

  async onInstall(): Promise<void> {
    // 默认空实现
  }

  async onUninstall(): Promise<void> {
    // 默认空实现
  }
}

/**
 * Trigger 节点基类
 */
export abstract class TriggerNode extends PluginBase {
  constructor(manifest: Omit<PluginManifest, 'category'> & Partial<Pick<PluginManifest, 'category'>>, nodeConfig: NodeConfig) {
    super({ ...manifest, category: 'trigger' as NodeCategory }, nodeConfig)
  }

  // Trigger 特有方法
  abstract setup(): Promise<void>
  abstract teardown(): Promise<void>
  
  // 事件监听器（对于主动触发的 trigger）
  onTrigger?(callback: (data: Record<string, unknown>) => void): void
}

/**
 * Action 节点基类
 */
export abstract class ActionNode extends PluginBase {
  constructor(manifest: Omit<PluginManifest, 'category'> & Partial<Pick<PluginManifest, 'category'>>, nodeConfig: NodeConfig) {
    super({ ...manifest, category: 'action' as NodeCategory }, nodeConfig)
  }
}

/**
 * Transform 节点基类
 */
export abstract class TransformNode extends PluginBase {
  constructor(manifest: Omit<PluginManifest, 'category'> & Partial<Pick<PluginManifest, 'category'>>, nodeConfig: NodeConfig) {
    super({ ...manifest, category: 'transform' as NodeCategory }, nodeConfig)
  }
} 