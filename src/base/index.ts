import type {
  PluginManifest,
  PluginExecutionContext,
  ExecutionResult,
  BaseNodePort,
  PortConfig,
  NodeCategory,
  NodeConfigSchema,
} from "../types";

/**
 * 插件基类 - 所有插件都应该继承此类
 */
export abstract class PluginBase {
  protected logger?: Console;

  constructor() {
    this.logger = console;
  }

  abstract setup?(): Promise<void>;
  abstract teardown?(): Promise<void>;
  abstract execute(
    inputs: Record<string, unknown>,
    context: PluginExecutionContext
  ): Promise<ExecutionResult>;

  /**
   * 获取插件清单
   */
  abstract getManifest(): PluginManifest;

  /**
   * 获取端口配置
   */
  abstract getPortConfig(): PortConfig;

  /**
   * 获取配置模式（可选实现）
   * 定义用户在使用节点时需要填写的配置字段
   */
  getConfigSchema?(): NodeConfigSchema;

  /**
   * 获取输入端口
   */
  getInputPorts(): BaseNodePort[] {
    return this.getPortConfig().ports.filter(
      (port) => port.type === "input" && port.required !== false
    );
  }

  /**
   * 获取输出端口
   */
  getOutputPorts(): BaseNodePort[] {
    return this.getPortConfig().ports.filter((port) => port.type === "output");
  }

  /**
   * 验证输入数据
   */
  async validateInputs(inputs: Record<string, unknown>): Promise<boolean> {
    const requiredInputs = this.getInputPorts()
      .filter((port) => port.required === true)
      .map((port) => port.id);

    for (const requiredInput of requiredInputs) {
      if (!(requiredInput in inputs) || inputs[requiredInput] === undefined) {
        return false;
      }
    }

    return true;
  }
}

/**
 * Trigger 节点基类
 */
export abstract class TriggerNode extends PluginBase {
  constructor() {
    super();
  }

  // Trigger 特有方法
  abstract setup(): Promise<void>;
  abstract teardown(): Promise<void>;

  // 事件监听器（对于主动触发的 trigger）
  onTrigger?(callback: (data: Record<string, unknown>) => void): void;
}

/**
 * Action 节点基类
 */
export abstract class ActionNode extends PluginBase {
  constructor() {
    super();
  }
}

/**
 * Transform 节点基类
 */
export abstract class TransformNode extends PluginBase {
  constructor() {
    super();
  }
}

/**
 * Control 节点基类
 */
export abstract class ControlNode extends PluginBase {
  constructor() {
    super();
  }
}

/**
 * AI 节点基类
 */
export abstract class AINode extends PluginBase {
  constructor() {
    super();
  }
}
