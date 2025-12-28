# EasyScreenShot (EasyShot)

一个基于 Electron 的跨平台截图工具。支持“取景框”模式，鼠标可穿透操作其他窗口。

## 安装

```bash
npm install -g easyscreen-shot
# 或者在本项目下
npm install
npm link
```

## 使用方法

### 基础用法
```bash
easyshot
```
启动后会显示一个绿色框（取景框）。
- **拖动/缩放**：调整截图区域。
- **穿透操作**：框中间透明，可以直接点击背后的窗口。
- **保存**：点击 `✅` 截图并保存到桌面（默认），程序会自动退出。

### 高级用法 (CLI 参数)

#### 1. 连续截图 (--watch)
截图后不退出，保持取景框位置，适合连续截取同一位置的内容。
```bash
easyshot --watch
# 或者
easyshot -w
```
点击 `✅` 保存截图后，框依然保留，可随时再点保存。

#### 2. 自定义保存路径 (--output)
将截图保存到指定文件夹（必须存在）。
```bash
easyshot --output /path/to/folder
# 或者
easyshot -o ~/Documents
```

#### 3. 查看帮助 (--help)
```bash
easyshot --help
```

## 开发
```bash
npm install
npm start -- --watch  # 开发模式下传参
```
