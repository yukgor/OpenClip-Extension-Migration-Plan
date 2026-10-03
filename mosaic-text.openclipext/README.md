# Mosaic Text · 马赛克文本

Replace selected text with a configurable mosaic character. A port of the PopClip extension of the same name for OpenClip.

用可配置的打码字符替换选中的文本。本扩展为同名 PopClip 扩展的 OpenClip 移植版。

## Usage / 用法

1. Select any text you want to redact 选择您想要编辑的任何文本。.
2. Open the OpenClip popup and choose **Mosaic / 打马赛克**.
3. The selected text is replaced by the mosaic character (one character per original character); the **original text is copied to the clipboard** so you can recover it by pasting 所选文本被替换为马赛克字符（每个原始字符一个字符）；原始文本被复制到剪贴板，以便您可以粘贴恢复。.

## Options / 设置

| Option                 | Type   | Default | Description                                             |
| ---------------------- | ------ | ------- | ------------------------------------------------------- |
| Mosaic Code / 打码字符 | Picker | `*`     | Choose the mask character used to replace the selection 选择用于替换选中内容的掩码字符|

Available characters 可用字符 : `*`, `#`, `■`, `●`, `▇`, `✱`, `×`, `＊`, `X`.

## Notes / 说明

- The mosaic length always matches the selected text length 马赛克长度始终与所选文本长度匹配.

## Statement / 声明

**This OpenClip extension is a port of the original PopClip plugin by [Seven Yu](https://github.com/dofy), licensed under the MIT License.**
