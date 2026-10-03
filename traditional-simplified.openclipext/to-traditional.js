"use strict";
/* to-traditional.js — 将选中的简体中文转换为繁体中文 */
var core = require("./core.js");

function action(selection) {
  // 原 PopClip 扩展通过布尔选项控制动作显隐；OpenClip 无“按选项显隐”机制，
  // 改为在脚本内判断：选项关闭时给出提示，不执行转换。
  if (openclip.option("showTraditional") === "false") {
    var msg = openclip.i18n
      ? openclip.i18n({ en: "Convert to Traditional is disabled in Settings", "zh-Hans": "“转为繁体”已在设置中关闭", "zh-Hant": "「轉為繁體」已在設定中關閉" })
      : "Convert to Traditional is disabled in Settings";
    openclip.toast(msg, "info");
    return;
  }
  var mode = openclip.option("conversionMode") === "char" ? "char" : "phrase";
  openclip.paste(core.toTraditional(selection, mode));
}

module.exports = { action: action };
