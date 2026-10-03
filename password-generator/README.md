# Password Generator · 密码生成器

Generate a random password with configurable character classes. A port of the PopClip extension of the same name for OpenClip.

生成可配置字符类别的随机密码。本扩展为同名 PopClip 扩展的 OpenClip 移植版。

## Usage / 用法

1. Open the OpenClip popup anywhere and choose **Generate Password / 生成密码** (no text selection required)  在任何位置打开 OpenClip 弹窗并选择生成密码 / 生成密码（无需选择文本）.
2. The action returns the password as plain text — **OpenClip decides how to deliver it**, exactly like its built-in actions 该操作会以纯文本形式返回密码 —— OpenClip 会像其内置操作一样决定如何交付该密码。.

## Where the result goes / 结果去向（由 OpenClip 原生控制）

This extension performs **no** paste / copy / toast of its own. It simply returns the generated password, so the **native “When finished → Where to send the output of this action”** setting decides the delivery 这个扩展自身不执行粘贴/复制/通知。它只返回生成的密码，所以由“完成时→将此操作的输出发送到何处”的本地设置来决定传输方式:

- **Show in Card** — the password renders in OpenClip’s native result card (popup stays open; you can copy or paste from the card, or right-click / ⇧-click to copy) **显示在卡片中**——密码以OpenClip原生结果卡片的形式呈现（弹出窗口保持打开状态；您可以从卡片中复制或粘贴，或右键单击/⇧-单击以复制）.
- **Paste** — pastes into the frontmost app (auto-downgraded to copy if the target cannot paste) **粘贴**——粘贴到最前面的应用（如果目标无法粘贴，将自动降级为复制）.
- **Copy** — copies to the clipboard **复制** — 复制到剪贴板.

Recommended default is **Show in Card** (`result: "preview"`); change it anytime in the action’s settings.

## Options / 设置

| Option                              | Type    | Default | Description                                                  |
| ----------------------------------- | ------- | ------- | ------------------------------------------------------------ |
| Password Length / 密码长度          | Picker  | 16      | Choose a length from 密码长度可选 8 / 12 / 16 / 20 / 24 / 32 / 48 / 64 |
| Lowercase 小写 (a-z)                | Boolean | On      | Include lowercase letters 包含小写字母                       |
| Uppercase 大写 (A-Z)                | Boolean | On      | Include uppercase letters 包含大写字母                       |
| Numbers  数字 (0-9)                 | Boolean | On      | Include digits 包含数字                                      |
| Symbols 符号                        | Boolean | On      | Include symbols 包含符号                                     |
| Custom symbols 自定义符号           | String  | (empty) | Override the built-in symbol set when Symbols is on 当符号 (Symbols) 处于开启状态时，覆盖内置符号集. Empty = `!@#$%^&*()_+-=[]{};:,./<>?\|` |
| Exclude look-alikes 排除易混字符    | Boolean | Off     | Exclude 排除 `0 O 1 l I \|`                                  |
| No adjacent duplicates 禁止相邻重复 | Boolean | Off     | Avoid the same character twice in a row 避免连续出现相同的字符 |

## Guarantees / 保证

- **CSPRNG**: characters are drawn with rejection sampling from `crypto.getRandomValues` (WebCrypto), no modulo bias — same security level as the original PopClip extension **CSPRNG**：字符通过从`crypto.getRandomValues`（WebCrypto）中进行拒绝采样生成，无模偏置——与原始PopClip扩展的安全级别相同.
- **Class presence**: every enabled character class is guaranteed to appear at least once in the password **类存在**：每个启用的字符类保证在密码中至少出现一次.
- If all character classes are disabled, it falls back to lowercase letters so the password is never empty 如果所有字符类别都被禁用，它将回退到小写字母，因此密码永远不会为空.
- Length is clamped to 4–256; a missing/invalid value defaults to 16 长度限制为4-256；缺失或无效的值默认为16.

## Notes / 说明

- The original extension’s `After generating` option and its non-native “show” popup were removed: result delivery is now fully governed by OpenClip’s native output setting.
- The original two UI section headings (“Character classes” / “Advanced”) have no OpenClip equivalent and were dropped; all functional options are preserved.
- Password Length is offered as a preset picker (the original was a free-text field). Values outside the presets require editing `openclip.json`.

## Statement / 声明

**This OpenClip extension is a port of the original PopClip plugin by [Seven Yu](https://github.com/dofy), licensed under the MIT License.**
