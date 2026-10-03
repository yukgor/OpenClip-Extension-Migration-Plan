"use strict";
/*
 * main.js — 密码生成器
 * 由 PopClip 扩展 password-generator（Main.ts）移植。
 * This OpenClip extension is a port of the original PopClip plugin by Seven Yu, licensed under the MIT License.
 * 此 OpenClip 扩展是 Seven Yu 开发的原始 PopClip 插件的移植版本，采用 MIT 许可证授权。
 * 生成逻辑与原版一致：
 *  - CSPRNG 随机（WebCrypto getRandomValues，拒绝采样消除模偏差）
 *  - 每个启用的字符类别至少出现一次
 *  - 支持排除易混字符、禁止相邻重复、自定义符号集
 *  - 结果交付完全交由 OpenClip 原生控制（“When finished → Where to send the output”：
 *    Show in Card / Paste / Copy），插件只返回密码字符串，不做任何展示/粘贴/复制动作
 */

var LOWER = "abcdefghijklmnopqrstuvwxyz";
var UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var NUMBERS = "0123456789";
var SYMBOLS = "!@#$%^&*()_+-=[]{};:,./<>?\\|";
var AMBIGUOUS = ["0", "O", "1", "l", "I", "|"];

// 安全随机整数：返回 [0, max] 的均匀整数（含两端）。
// OpenClip 的 JavaScriptCore 提供 WebCrypto（crypto.getRandomValues），
// 使用拒绝采样避免模偏差；若极端环境下不可用则回退 Math.random（非密码学安全，仅兜底）。
function secureRandomInt(max) {
  var range = max + 1;
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    var buf = new Uint32Array(1);
    var limit = Math.floor(0x100000000 / range) * range;
    do {
      crypto.getRandomValues(buf);
    } while (buf[0] >= limit);
    return buf[0] % range;
  }
  return Math.floor(Math.random() * range);
}

// 布尔选项在 OpenClip 中为字符串 "true"/"false"，兼容各种取值
function isOn(v) {
  return v === true || v === "true" || v === "1" || v === 1;
}

function pick(chars) {
  return chars.charAt(secureRandomInt(chars.length - 1));
}

function shuffle(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = secureRandomInt(i);
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

function clean(chars, excludeAmbiguous) {
  if (!excludeAmbiguous) return chars;
  var out = "";
  for (var i = 0; i < chars.length; i++) {
    if (AMBIGUOUS.indexOf(chars[i]) === -1) out += chars[i];
  }
  return out;
}

function clampLength(raw) {
  var n = parseInt(String(raw == null ? "" : raw), 10);
  if (!isFinite(n)) return 16;
  return Math.max(4, Math.min(256, n));
}

function generatePassword(opts) {
  var length = clampLength(opts.leng);
  var excl = isOn(opts.excludeAmbiguous);

  var classes = [];
  if (isOn(opts.lowercase)) classes.push(clean(LOWER, excl));
  if (isOn(opts.uppercase)) classes.push(clean(UPPER, excl));
  if (isOn(opts.number)) classes.push(clean(NUMBERS, excl));
  if (isOn(opts.symbol)) {
    var custom = String(opts.customSymbols == null ? "" : opts.customSymbols).trim();
    classes.push(clean(custom.length > 0 ? custom : SYMBOLS, excl));
  }

  // 全部类别关闭时回退到小写字母，保证永远不产生空密码
  var usable = classes.filter(function (c) { return c.length > 0; });
  if (usable.length === 0) usable.push(LOWER);

  var pool = usable.join("");

  // noRepeat 仅在字符池至少含 2 个不同字符时才可满足
  var forbidRepeat = isOn(opts.noRepeat) && new Set(pool).size > 1;

  var pickNext = function (prev, source) {
    if (!forbidRepeat || prev === undefined) return pick(source);
    // 有界重试，失败后回退到任意非 prev 字符
    for (var i = 0; i < 8; i++) {
      var c = pick(source);
      if (c !== prev) return c;
    }
    var alt = [];
    for (var j = 0; j < source.length; j++) {
      if (source[j] !== prev) alt.push(source[j]);
    }
    return alt.length > 0 ? alt[secureRandomInt(alt.length - 1)] : pick(source);
  };

  // 每个启用的类别先播种一个字符，保证该类别必然出现；随后填充到目标长度
  var chars = [];
  for (var k = 0; k < usable.length; k++) {
    chars.push(pickNext(chars[chars.length - 1], usable[k]));
  }
  while (chars.length < length) {
    chars.push(pickNext(chars[chars.length - 1], pool));
  }

  // 打乱播种字符（避免保证项集中在开头），若开启 noRepeat 再复查相邻重复
  var password = shuffle(chars).slice(0, length).join("");
  if (forbidRepeat) {
    var buf = password.split("");
    for (var m = 1; m < buf.length; m++) {
      if (buf[m] === buf[m - 1]) buf[m] = pickNext(buf[m - 1], pool);
    }
    password = buf.join("");
  }
  return password;
}

function action(selection) {
  var opts = {
    leng: openclip.option("leng"),
    lowercase: openclip.option("lowercase"),
    uppercase: openclip.option("uppercase"),
    number: openclip.option("number"),
    symbol: openclip.option("symbol"),
    customSymbols: openclip.option("customSymbols"),
    excludeAmbiguous: openclip.option("excludeAmbiguous"),
    noRepeat: openclip.option("noRepeat")
  };
  // 仅返回密码字符串：OpenClip 将按原生 “Where to send the output”
  // 设置决定展示方式（Show in Card / Paste / Copy），插件不干预。
  return generatePassword(opts);
}

module.exports = { action: action };
