/**
 * Configuration Field Types
 */

import type { PluginI18nText } from "./i18n-text";
import type { ReactNode } from "react";

/**
 * 基础字段类型
 */
export type FieldType = "string" | "number" | "boolean" | "select" | "date";

export type FieldsFieldType =
  | "string"
  | "number"
  | "boolean"
  | "select"
  | "date"
  | "array[string]";

export type FieldComponent =
  | "switch"
  | "checkbox"
  | "select"
  | "input"
  | "textarea"
  | "number"
  | "date"
  | "javascript"
  | "python3"
  | "json"
  | "range";

/**
 * 普通选择器的选项
 */
export type ExtendedFieldOption = {
  icon?: ReactNode;
  label: string | PluginI18nText;
  value: string;
};

type ExtendedFieldCollection = {
  label: string | PluginI18nText;
  values: Array<ExtendedFieldConfig>;
};

export type ExtendedFieldConfigOption =
  | ExtendedFieldOption
  | ExtendedFieldConfig
  | ExtendedFieldCollection;

/**
 * 配置字段
 */
export interface ExtendedFieldConfig {
  description?: string | PluginI18nText;
  enableAiOverride?: boolean;
  hint?: string | PluginI18nText;
  key: string;
  label?: string | PluginI18nText;
  options?: Array<ExtendedFieldConfigOption>;
  placeholder?: string | PluginI18nText;
  required?: boolean;
  sensitive?: boolean;
  defaultValue?: unknown;
  supportExpression?: boolean;
  type: FieldsFieldType;
  fieldPath?: string;
  ui?: {
    /**
     * 单选字段允许清除已选中
     */
    allowClearSelect?: boolean;
    children?: ReactNode;
    component?: FieldComponent;
    decimal?: number;
    expression?: string;
    group?: string;
    labelPrefix?: ReactNode;
    maxHeight?: number;
    minHeight?: number;
    multiple?: boolean;
    order?: number;
    size?: string;
    step?: number;
    variable?: string;
    width?: "small" | "medium" | "full";
  };
  // for select type
  validation?: {
    maxLength?: number;
    maxValue?: number;
    message?: string;
    minLength?: number;
    minValue?: number;
    pattern?: string;
  };
}

/**
 * 配置分组
 */
export interface ExtendedGroupConfig {
  collapsed?: boolean;
  description?: string | PluginI18nText;
  label: string | PluginI18nText;
  fields: Array<string>;
  key: string;
  sort?: number;
}

/**
 * 节点配置模式
 */
export interface ExtendedConfigSchema {
  /** 配置字段列表 */
  fields: Array<ExtendedFieldConfig>;
  /** 配置分组 */
  groups?: Record<string, ExtendedGroupConfig>;
}
