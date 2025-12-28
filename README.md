# EasyScreenShot (EasyShot)

一个基于 Electron 的跨平台截图工具。旨在支持自定义长宽，并可调节截图内容，持续定位截图。

## 功能
- **绿色选框**: 启动后出现覆盖全屏的截图界面，拖动鼠标选择区域。
- **工具栏**:
    - 自定义输入 Width (W) 和 Height (H)。
    - `✕` 关闭/取消。
    - `✅` 保存截图到桌面。
- **跨平台**: 支持 macOS 和 Windows。

## 安装与启动

### 1. 安装依赖
```bash
npm install
```

### 2. 启动
```bash
# 方式 A: 直接使用 npm 脚本
npm start

# 方式 B: 使用全局命令 (模拟安装后)
npm link
easyshot
```

## 全局安装 (发布后)
用户可以通过 npm 全局安装使用：
```bash
npm install -g easy-screen-shot
easyshot
```
