# 📦 发布 EasyScreenshot 到 npm

本指南将帮助你将 EasyScreenshot 发布到 npm，让全球用户可以通过 `npm install -g` 安装使用。

---

## 📋 发布前检查清单

### 1. 确保你有 npm 账号

如果还没有，先注册一个：

```bash
npm adduser
```

或者在 [npmjs.com](https://www.npmjs.com/signup) 注册后登录：

```bash
npm login
```

### 2. 验证登录状态

```bash
npm whoami
```

---

## 🔧 发布前准备

### 1. 更新 `package.json`

确保以下字段正确填写：

```json
{
  "name": "easyscreen-shot",
  "version": "1.0.0",
  "description": "Cross-platform screenshot tool with Green Box UI",
  "main": "main.js",
  "bin": {
    "easyshot": "bin/easyshot.js"
  },
  "keywords": [
    "screenshot",
    "electron",
    "screen-capture",
    "mac",
    "windows",
    "linux"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_USERNAME/EasyScreenshot.git"
  },
  "author": "Your Name <your.email@example.com>",
  "license": "MIT",
  "homepage": "https://github.com/YOUR_USERNAME/EasyScreenshot#readme",
  "bugs": {
    "url": "https://github.com/YOUR_USERNAME/EasyScreenshot/issues"
  }
}
```

> ⚠️ **重要**: `name` 必须是 npm 上唯一的。建议先在 [npmjs.com](https://www.npmjs.com/) 搜索确认名称未被占用。

### 2. 确保 `.gitignore` 包含以下内容

```
node_modules/
.DS_Store
*.log
```

### 3. 创建 `.npmignore`（可选）

排除不需要发布的文件：

```
.git
.gitignore
.DS_Store
*.log
```

---

## 🚀 发布步骤

### 第一次发布

```bash
# 1. 确保在项目根目录
cd /path/to/EasyScreenshot

# 2. 安装依赖
npm install

# 3. 发布！
npm publish
```

### 更新版本后发布

```bash
# 方式一：手动修改 package.json 中的 version

# 方式二：使用 npm version 命令自动更新
npm version patch   # 1.0.0 -> 1.0.1 (小修复)
npm version minor   # 1.0.0 -> 1.1.0 (新功能)
npm version major   # 1.0.0 -> 2.0.0 (重大更新)

# 然后发布
npm publish
```

---

## ✅ 发布成功后

用户可以通过以下命令安装：

```bash
npm install -g easyscreen-shot
```

然后使用：

```bash
easyshot          # 基础截图
easyshot -w       # 连续截图模式
easyshot -o ~/Pictures  # 设置保存目录
easyshot -h       # 查看帮助
```

---

## 🔍 常见问题

### Q: 发布时提示 "You do not have permission"

**原因**: 包名已被占用

**解决方案**: 更换一个唯一的包名，或使用 scoped package：

```json
{
  "name": "@your-username/easyscreen-shot"
}
```

发布 scoped package：

```bash
npm publish --access public
```

---

### Q: 发布时提示 "You must be logged in"

**解决方案**:

```bash
npm login
```

---

### Q: 如何撤销发布的版本？

```bash
npm unpublish easyscreen-shot@1.0.0
```

> ⚠️ 注意：24小时后无法撤销已发布的版本

---

### Q: 如何查看我发布的包？

访问：`https://www.npmjs.com/package/easyscreen-shot`

或使用命令：

```bash
npm view easyscreen-shot
```

---

## 📝 发布前最终检查

- [ ] `package.json` 中的 `name` 是唯一的
- [ ] `version` 号已更新
- [ ] `description` 描述清晰
- [ ] `keywords` 便于搜索
- [ ] `author` 和 `license` 已填写
- [ ] `README.md` 内容完整
- [ ] 已运行 `npm login` 登录

---

## 🎉 恭喜！

发布成功后，全球的开发者都可以使用你的截图工具了！

```bash
npm install -g easyscreen-shot && easyshot
```
