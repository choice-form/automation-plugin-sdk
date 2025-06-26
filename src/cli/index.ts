#!/usr/bin/env node

import { Command } from "commander";
import { createCommand } from "./commands/create.js";
import { validateCommand } from "./commands/validate.js";
import { buildCommand } from "./commands/build.js";
import { devCommand } from "./commands/dev.js";

const program = new Command();

program
  .name("@choiceform/automation-sdk")
  .description("Plugin SDK for Automation Platform")
  .version("1.0.0");

// 注册命令
program.addCommand(createCommand);
program.addCommand(validateCommand);
program.addCommand(buildCommand);
program.addCommand(devCommand);

// 解析命令行参数
program.parse();
