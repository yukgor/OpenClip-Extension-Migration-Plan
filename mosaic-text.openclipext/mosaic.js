"use strict";
/*
 * mosaic.js — 马赛克打码
 * This OpenClip extension is a port of the original PopClip plugin by Seven Yu, licensed under the MIT License.
 * 此 OpenClip 扩展是 Seven Yu 开发的原始 PopClip 插件的移植版本，采用 MIT 许可证授权。
 * 由 PopClip 扩展 mosaic-text 移植：
 * 用打码字符（长度与选区一致）粘贴替换选中文本，
 * 同时把原文复制到剪贴板，便于误操作后恢复。
 */
function action(selection) {
  var mosaicCode = openclip.option("mosaic-code") || "*";
  var result = new Array(selection.length).fill(mosaicCode).join("");

  // 与原扩展一致：先粘贴打码结果，再把原文放回剪贴板用于恢复
  openclip.paste(result);
  openclip.copy(selection);

  var msg = openclip.i18n
    ? openclip.i18n({
        en: "Mosaic pasted. Original text kept on clipboard.",
        "zh-Hans": "已打码粘贴，原文已保留在剪贴板。",
        "zh-Hant": "已打碼貼上，原文已保留在剪貼板。",
        ja: "モザイクを貼り付けました。元のテキストはクリップボードに残っています。"
      })
    : "Mosaic pasted. Original text kept on clipboard.";
  openclip.toast(msg, "success");
}

module.exports = { action: action };
