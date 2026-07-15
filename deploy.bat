@echo off
chcp 65001 >nul
echo =========================================
echo    深度学习课程站 - 本地部署脚本
echo =========================================
echo.

:: 检查是否传入仓库名参数
set REPO_NAME=%1
if "%REPO_NAME%"=="" set REPO_NAME=deep-learning-courses

:: 检查是否在course-site目录内
if not exist "index.html" (
    echo [错误] 请将此脚本放在 course-site 目录内运行
    pause
    exit /b 1
)

echo [1/4] 初始化Git仓库...
git init
git add .
git commit -m "init: 深度学习课程站 - CNN讲义上线"

echo.
echo [2/4] 关联远程仓库 https://github.com/vita1982/%REPO_NAME%.git...
git remote add origin https://github.com/vita1982/%REPO_NAME%.git 2>nul
git branch -M main

echo.
echo [3/4] 正在推送到GitHub...
git push -u origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo =========================================
    echo [推送失败] 可能的原因：
    echo   1. 仓库 https://github.com/vita1982/%REPO_NAME% 尚未创建
    echo   2. GitHub需要身份验证（用户名/密码或PAT）
    echo.
    echo [解决方案]：
    echo   A. 先在GitHub网页创建空仓库 vita1982/%REPO_NAME%
    echo   B. 如果提示密码，请输入GitHub Personal Access Token
    echo      （而不是登录密码）
    echo   C. 或改用SSH方式（需配置SSH密钥）
    echo =========================================
    pause
    exit /b 1
)

echo.
echo [4/4] 推送成功！
echo.
echo =========================================
echo  下一步：启用 GitHub Pages
echo =========================================
echo  1. 访问 https://github.com/vita1982/%REPO_NAME%/settings/pages
       
echo  2. Source 选择 "Deploy from a branch"
       
echo  3. Branch 选择 "main"，目录选择 "/ (root)"
       
echo  4. 保存后约1分钟，访问：
echo     https://vita1982.github.io/%REPO_NAME%/
echo =========================================
pause
