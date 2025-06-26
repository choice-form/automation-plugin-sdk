import { Command } from "commander";
import { execSync } from "child_process";
import chalk from "chalk";
import ora from "ora";
import path from "path";
import fs from "fs-extra";

interface PluginManifest {
  name: string;
  version: string;
  description: string;
  author: string;
  [key: string]: any;
}

export const buildCommand = new Command("build")
  .description("Build a plugin and create .choiceformpkg package")
  .argument("[plugin-path]", "Path to plugin directory", ".")
  .option("--no-clean", "不清理输出目录")
  .option("--no-package", "只编译，不创建包文件")
  .action(
    async (
      pluginPath: string,
      options: { noClean?: boolean; noPackage?: boolean }
    ) => {
      const spinner = ora("Building plugin...").start();

      try {
        const originalCwd = process.cwd();
        const resolvedPluginPath = path.resolve(pluginPath);
        process.chdir(resolvedPluginPath);

        // 1. 清理输出目录
        if (!options.noClean) {
          if (await fs.pathExists("./dist")) {
            await fs.remove("./dist");
            spinner.text = "Cleaned output directory";
          }
        }

        // 2. 运行 TypeScript 编译
        spinner.text = "Compiling TypeScript...";
        execSync("npx tsc", { stdio: "pipe" });

        // 3. 验证必要文件
        spinner.text = "Validating plugin files...";
        const requiredFiles = ["package.json", "plugin.manifest.json"];

        for (const file of requiredFiles) {
          if (!(await fs.pathExists(file))) {
            throw new Error(`Required file missing: ${file}`);
          }
        }

        // 4. 读取插件信息
        const packageJson = await fs.readJson("./package.json");
        const manifest: PluginManifest = await fs.readJson(
          "./plugin.manifest.json"
        );

        if (!options.noPackage) {
          // 5. 创建 .choiceformpkg 包
          spinner.text = "Creating .choiceformpkg package...";

          // 创建临时打包目录
          const tempDir = "./temp_package";
          await fs.ensureDir(tempDir);

          try {
            // 复制编译后的文件
            if (await fs.pathExists("./dist")) {
              await fs.copy("./dist", tempDir);
              spinner.text = "Copied compiled files...";
            }

            // 复制必要的配置文件
            const filesToCopy = [
              "package.json",
              "plugin.manifest.json",
              "plugin.registry.json",
              "README.md",
              "icon.svg",
              "icon.png",
            ];

            for (const file of filesToCopy) {
              if (await fs.pathExists(file)) {
                await fs.copy(file, path.join(tempDir, file));
              }
            }

            // 生成安全的包文件名
            const pluginName =
              manifest.name || packageJson.name || "unnamed-plugin";
            const version = manifest.version || packageJson.version || "1.0.0";

            // 清理包名中的特殊字符
            const safeName = pluginName
              .replace(/[@\/]/g, "-")
              .replace(/^-+|-+$/g, "");
            const packageName = `${safeName}-${version}.choiceformpkg`;

            // 检查临时目录内容
            const tempFiles = await fs.readdir(tempDir);
            if (tempFiles.length === 0) {
              throw new Error("No files to package - build may have failed");
            }

            spinner.text = `Creating package: ${packageName}...`;

            // 创建 tar.gz 包（.choiceformpkg 本质上是 gzip 压缩的 tar 文件）
            execSync(`tar -czf "../${packageName}" .`, {
              cwd: tempDir,
              stdio: "pipe",
            });

            // 验证包文件创建成功
            const packagePath = `./${packageName}`;
            if (!(await fs.pathExists(packagePath))) {
              throw new Error(`Failed to create package: ${packageName}`);
            }

            const stats = await fs.stat(packagePath);
            const sizeKB = Math.round(stats.size / 1024);

            spinner.succeed(`Plugin package created successfully!`);
            console.log(chalk.cyan(`📦 Package: ${packageName} (${sizeKB}KB)`));
            console.log(chalk.gray(`📁 Build output: ./dist/`));

            // 显示包内容摘要
            console.log(chalk.cyan("\n📋 Package contents:"));
            const listContents = execSync(`tar -tzf "${packageName}"`, {
              encoding: "utf8",
              stdio: "pipe",
            });
            const files = listContents
              .trim()
              .split("\n")
              .filter((f) => f && !f.endsWith("/"));
            files.slice(0, 10).forEach((file) => {
              console.log(chalk.gray(`   ${file}`));
            });
            if (files.length > 10) {
              console.log(
                chalk.gray(`   ... and ${files.length - 10} more files`)
              );
            }
          } finally {
            // 清理临时目录
            if (await fs.pathExists(tempDir)) {
              await fs.remove(tempDir);
            }
          }
        } else {
          spinner.succeed("Plugin compiled successfully!");
          console.log(chalk.cyan("📦 Build output: ./dist/"));
          console.log(
            chalk.yellow("ℹ️  Package creation skipped (--no-package)")
          );
        }

        // 恢复工作目录
        process.chdir(originalCwd);
      } catch (error) {
        spinner.fail(
          `Build failed: ${error instanceof Error ? error.message : error}`
        );
        console.error(chalk.red("\n🔍 Troubleshooting tips:"));
        console.error(
          chalk.gray("• Make sure package.json and plugin.manifest.json exist")
        );
        console.error(
          chalk.gray("• Verify TypeScript configuration is correct")
        );
        console.error(
          chalk.gray("• Check that all dependencies are installed")
        );
        process.exit(1);
      }
    }
  );
