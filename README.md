# 深度学习课程站

基于纯静态 HTML/CSS/JS 构建的课程网站，可部署到 GitHub Pages 等免费静态托管平台。

---

## 🚀 一键部署到 GitHub（Windows）

1. 在 GitHub 登录 vita1982 账号，创建空仓库：`deep-learning-courses`
   - 不要勾选 README、.gitignore 等初始化文件

2. 将整个 `course-site` 文件夹复制到本地任意位置

3. 进入 `course-site` 文件夹，双击运行 `deploy.bat`

4. 脚本会自动完成 Git 初始化、提交、推送

5. 如果提示输入密码，请使用 GitHub **Personal Access Token**（不是登录密码）

6. 推送成功后，进入仓库 **Settings → Pages** 启用 GitHub Pages

---

## 🔑 使用 SSH 方式部署（推荐，无需每次输入Token）

如果你已经将本机的 SSH 公钥添加到 GitHub 账户，可以直接用 SSH 方式推送：

```bash
cd course-site
git init
git add .
git commit -m "init: 深度学习课程站"

git remote add origin git@github.com:vita1982/deep-learning-courses.git
git branch -M main
git push -u origin main
```

---

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
├── deploy.bat                  # Windows 一键部署脚本
└── README.md
```

---

## 📝 添加新课程

1. 在 `courses/` 目录下创建新文件夹，例如 `courses/rnn/`
2. 将课程讲义 HTML 放入该文件夹的 `index.html`
3. 将课程图片放入 `courses/rnn/images/` 目录
4. 修改主页 `index.html`，在课程网格中添加新卡片

---

## 🎨 技术特点

- **纯静态**：无后端、无数据库，加载速度快
- **响应式**：适配桌面端和移动端
- **LaTeX 公式**：使用 KaTeX 实时渲染数学公式
- **平滑导航**：左侧目录自动高亮当前章节
- **免费部署**：完全兼容 GitHub Pages / Netlify / Vercel

---

*深度学习课程站 · 持续更新中*
