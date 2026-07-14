# 深度学习课程站

基于纯静态 HTML/CSS/JS 构建的课程网站，可部署到 GitHub Pages 等免费静态托管平台。

## 📁 目录结构

```
course-site/
├── index.html                  # 主页 - 课程列表
├── css/
│   └── style.css               # 全局样式
├── courses/
│   └── cnn/
│       ├── index.html          # 第04讲：卷积神经网络（CNN）
│       └── images/             # 课程图片资源
└── README.md
```

## 🚀 部署到 GitHub Pages（推荐）

### 方式一：直接上传（最简单）

1. 在 GitHub 创建一个新仓库，例如 `deep-learning-courses`
2. 将本目录下所有文件上传到仓库根目录
3. 进入仓库 **Settings → Pages**
4. 在 **Source** 中选择 `Deploy from a branch`，分支选 `main`，目录选 `/ (root)`
5. 保存后等待约 1 分钟，访问 `https://你的用户名.github.io/deep-learning-courses/` 即可

### 方式二：使用 Git 命令行

```bash
# 初始化仓库
git init
git add .
git commit -m "init: 深度学习课程站"

# 关联远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/你的用户名/deep-learning-courses.git
git branch -M main
git push -u origin main
```

## 📝 添加新课程

1. 在 `courses/` 目录下创建新文件夹，例如 `courses/rnn/`
2. 将课程讲义 HTML 放入该文件夹的 `index.html`
3. 将课程图片放入 `courses/rnn/images/` 目录
4. 修改主页 `index.html`，在课程网格中添加新卡片

新课程的 `index.html` 建议从现有课程（如 `courses/cnn/index.html`）复制结构，保留顶部返回导航和 KaTeX 公式渲染支持。

## 🎨 技术特点

- **纯静态**：无后端、无数据库，加载速度快
- **响应式**：适配桌面端和移动端
- **LaTeX 公式**：使用 KaTeX 实时渲染数学公式
- **平滑导航**：左侧目录自动高亮当前章节
- **免费部署**：完全兼容 GitHub Pages / Netlify / Vercel

## 🖼️ 图片资源说明

课程讲义中的图片路径保持相对路径 `images/xxx`，确保与课程页面的 `index.html` 位于同一目录层级即可正确加载。

---

*基于《动手学深度学习》课程 · 持续更新中*
