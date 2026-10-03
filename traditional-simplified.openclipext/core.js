"use strict";
/*
 * core.js — 简繁转换引擎
  * This OpenClip extension is a port of the original PopClip plugin by Nick Moore, licensed under the MIT License.
 * 此 OpenClip 扩展是 Nick Moore 开发的原始 PopClip 插件的移植版本，采用 MIT 许可证授权。
 * 由 PopClip 扩展 traditional-simplified 的 module.bundle.js 移植：
 * 转换引擎（tongwen-core）逻辑逐行保留，仅将字典加载改为
 * OpenClip 模块加载器支持的 CommonJS .js 模块，并暴露转换函数。
 */
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// 字典模块（由 JSON 转换而来，CommonJS 格式）
var import_s2t_char = __toESM(require("./dict/s2t-char.js"));
var import_s2t_phrase = __toESM(require("./dict/s2t-phrase.js"));
var import_t2s_char = __toESM(require("./dict/t2s-char.js"));
var import_t2s_phrase = __toESM(require("./dict/t2s-phrase.js"));

// ---- tongwen-core 转换引擎（原样保留） ----
var toEsMap = function(dic) {
  return new Map(Object.entries(dic));
};
var indexMulti = function(multi) {
  return Object.entries(multi).reduce(function(list, _a) {
    var key = _a[0], value = _a[1];
    var index = key.substring(0, 2);
    var indexed = list.get(index) || (list.set(index, { max: 0, indies: /* @__PURE__ */ new Map() }), list.get(index));
    key.length > indexed.max && (indexed.max = key.length);
    indexed.indies.set(key, value);
    return list;
  }, /* @__PURE__ */ new Map());
};
var indexSuit = function(_a) {
  var single = _a.single, multi = _a.multi;
  return {
    single: toEsMap(single),
    multi: indexMulti(multi)
  };
};
var indexPackMap = function(_a) {
  var s2t = _a.s2t, t2s = _a.t2s;
  return {
    s2t: indexSuit(s2t),
    t2s: indexSuit(t2s)
  };
};
var __spreadArray = function(to, from) {
  for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
    to[j] = from[i];
  return to;
};
var mergeList = function(list) {
  return Object.assign.apply(Object, __spreadArray([{}], list));
};
var group = function(words) {
  return Object.entries(words).reduce(function(grouped, _a) {
    var key = _a[0], value = _a[1];
    return key.length > 1 ? (grouped.multi[key] = value, grouped) : (grouped.single[key] = value, grouped);
  }, { single: {}, multi: {} });
};
var groupPack = function(src) {
  return {
    s2t: group(mergeList(src.s2t)),
    t2s: group(mergeList(src.t2s))
  };
};
var createDicMap = function(src) {
  return indexPackMap(groupPack(src));
};
var isNotString = function(v) {
  return typeof v !== "string";
};
var isEmptyString = function(str) {
  return str.trim() === "";
};
var isEmpty = function(v) {
  return isNotString(v) || isEmptyString(v);
};
var convert = function(dic, text) {
  var converted = "";
  for (var pointer = 0; pointer < text.length; pointer++) {
    converted += dic.get(text[pointer]) || text[pointer];
  }
  return converted;
};
var convertChar = function(_a, text) {
  var single = _a.single;
  return isEmpty(text) ? "" : convert(single, text);
};
var convert2 = function(_a, text) {
  var single = _a.single, multi = _a.multi;
  var converted = "";
  var textLength = text.length;
  for (var pointer = 0; pointer < textLength; pointer++) {
    var index = text.substring(pointer, pointer + 2);
    var indexed = multi.get(index);
    var isFound = false;
    if (indexed) {
      var sliceLength = Math.min(textLength - pointer, indexed.max);
      for (; sliceLength > 1; sliceLength--) {
        var toMap = text.substring(pointer, pointer + sliceLength);
        if (indexed.indies.has(toMap)) {
          converted += indexed.indies.get(toMap);
          pointer += sliceLength - 1;
          isFound = true;
          break;
        }
      }
      !isFound && (converted += single.get(text[pointer]) || text[pointer]);
    } else {
      converted += single.get(text[pointer]) || text[pointer];
    }
  }
  return converted;
};
var convertPhrase = function(pack, text) {
  return isEmpty(text) ? "" : convert2(pack, text);
};
var createConverterMap = function(src) {
  var dic = createDicMap(src || { s2t: [], t2s: [] });
  var char = function(type, text) {
    return convertChar(dic[type], text);
  };
  var phrase = function(type, text) {
    return convertPhrase(dic[type], text);
  };
  return { char, phrase };
};
var LangType;
(function(LangType2) {
  LangType2["s2t"] = "s2t";
  LangType2["t2s"] = "t2s";
})(LangType || (LangType = {}));

// ---- 初始化字典 ----
var mConv = createConverterMap({
  s2t: [import_s2t_char.default, import_s2t_phrase.default],
  t2s: [import_t2s_char.default, import_t2s_phrase.default]
});

// ---- 导出接口 ----
function convertText(type, text, mode) {
  return mode === "char" ? mConv.char(type, text) : mConv.phrase(type, text);
}
module.exports = {
  toSimplified: function(text, mode) {
    return convertText(LangType.t2s, text, mode);
  },
  toTraditional: function(text, mode) {
    return convertText(LangType.s2t, text, mode);
  }
};
