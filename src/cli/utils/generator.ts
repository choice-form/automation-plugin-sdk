import fs from "fs-extra";
import path from "path";
import { generatePluginDirectoryName, sanitizePluginName } from "../../utils";
import { CreatePluginOptions } from "../../types/cli";

interface TemplateContext {
  name: string;
  author: string;
  description: string;
  kebabName: string;
  pascalName: string;
  camelName: string;
  createdAt: string;
  [key: string]: string;
}

/**
 * 处理模板文件（简单的字符串替换）
 */
export function processTemplate(
  content: string,
  context: TemplateContext
): string {
  let result = content;

  for (const [key, value] of Object.entries(context)) {
    const placeholder = new RegExp(`{{${key}}}`, "g");
    result = result.replace(placeholder, value);
  }

  return result;
}

/**
 * 递归拷贝并处理模板目录
 */
export async function copyTemplateDirectory(
  templatePath: string,
  targetPath: string,
  context: TemplateContext
): Promise<void> {
  const files = await fs.readdir(templatePath);

  for (const file of files) {
    const filePath = path.join(templatePath, file);
    const targetFilePath = path.join(targetPath, file);
    const stat = await fs.stat(filePath);

    if (stat.isDirectory()) {
      await fs.ensureDir(targetFilePath);
      await copyTemplateDirectory(filePath, targetFilePath, context);
    } else {
      const content = await fs.readFile(filePath, "utf-8");
      const processedContent = processTemplate(content, context);
      await fs.writeFile(targetFilePath, processedContent);
    }
  }
}

/**
 * 生成项目名称的各种格式
 */
export function generateNameVariants(
  name: string
): Pick<TemplateContext, "kebabName" | "pascalName" | "camelName"> {
  const kebabName = name.toLowerCase().replace(/\s+/g, "-");
  const pascalName = name
    .replace(/(?:^|\s)(\w)/g, (_, letter) => letter.toUpperCase())
    .replace(/\s+/g, "");
  const camelName = pascalName.charAt(0).toLowerCase() + pascalName.slice(1);

  return {
    kebabName,
    pascalName,
    camelName,
  };
}

/**
 * 生成插件模板
 */
export async function generatePlugin(
  options: CreatePluginOptions
): Promise<void> {
  const {
    name,
    author,
    description,
    template,
    outputDir = process.cwd(),
  } = options;

  const nameVariants = generateNameVariants(name);
  const pluginDirName = generatePluginDirectoryName(name, template);
  const targetPath = path.join(outputDir, pluginDirName);

  const templateContext: TemplateContext = {
    name,
    author,
    description,
    ...nameVariants,
    createdAt: new Date().toISOString(),
  };

  // 确保目标目录存在
  await fs.ensureDir(targetPath);

  // 这里可以根据需要实现具体的模板生成逻辑
  console.log(`Generated plugin ${name} at ${targetPath}`);
}
