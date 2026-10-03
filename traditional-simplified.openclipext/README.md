# Traditional/Simplified · 简繁转换器

Convert text between Traditional and Simplified Chinese. A port of the PopClip extension of the same name for OpenClip, powered by the [tongwen-core](https://github.com/penndu/tongwen) dictionary (OpenCC-based, phrase-aware).

在简体中文与繁体中文之间转换选中的文本。本扩展为同名 PopClip 扩展的 OpenClip 移植版，转换引擎与词库（OpenCC 系，支持词组优先）保持一致。

## Usage / 用法

1. Select any Chinese text (the actions appear only when the selection contains CJK characters) 选择任何中文文本（仅当选择包含CJK字符时动作才会出现）.
2. Open the OpenClip popup and choose 打开 OpenClip 弹出窗口并选择:

   - **Convert to Simplified / 转为简体** — pastes the simplified conversion **转为简体** — 粘贴简体转换结果.
   - **Convert to Traditional / 转为繁体** — pastes the traditional conversion **轉為繁體** — 貼上繁體轉換.

3. The converted text replaces the selection (paste); a right-click / ⇧-click copies it instead 转换后的文本替换所选内容（粘贴）；右键单击/⇧-单击复制它.

## Options / 设置

| Option | Type | Default | Description |
|---|---|---|---|
| Convert to Simplified | boolean | On | Enables the “Convert to Simplified” action |
| Convert to Traditional | boolean | On | Enables the “Convert to Traditional” action |
| Conversion Mode | picker | Phrase | `Phrase` prefers phrase-level dictionary matches; `Character` converts character by character |

## Notes / 说明

- The actions only appear when the selected text contains Chinese characters (`[\u4E00-\u9FFF\u3400-\u4DBF]`), matching the original extension 操作仅在所选文本包含中文字符（[\u4E00-\u9FFF\u3400-\u4DBF]）时出现，匹配原始扩展.
