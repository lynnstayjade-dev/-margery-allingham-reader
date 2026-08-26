# Margery Allingham Reader — 部署脚本
# 使用方法: 安装 Git 后，在 PowerShell 中运行此脚本

param(
    [string]$RepoName = "margery-allingham-reader"
)

$ErrorActionPreference = "Stop"
$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectDir

Write-Host "=== 艾林翰书斋 · Margery Allingham Reader 部署脚本 ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: 初始化 Git
if (-not (Test-Path ".git")) {
    Write-Host "[1/4] 初始化 Git 仓库..." -ForegroundColor Yellow
    git init
    git config user.name "Allingham Reader"
    git config user.email "reader@example.com"
} else {
    Write-Host "[1/4] Git 仓库已存在" -ForegroundColor Green
}

# Step 2: 添加文件（.gitignore 已排除分析脚本与未入库文件）
Write-Host "[2/4] 添加文件..." -ForegroundColor Yellow
git add .

# Step 3: 提交
Write-Host "[3/4] 创建提交..." -ForegroundColor Yellow
git commit -m "艾林翰书斋：28部公版阅读器 + 双语阅读（自译对照）+ LibriVox真人听书 + 中译本情报"

# Step 4: 提示推送到 GitHub
Write-Host ""
Write-Host "[4/4] 准备推送!" -ForegroundColor Green
Write-Host ""
Write-Host "接下来请手动执行以下步骤:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. 在 GitHub 创建新仓库: https://github.com/new" -ForegroundColor White
Write-Host "   仓库名称建议: $RepoName" -ForegroundColor White
Write-Host "   不要勾选 'Add a README file'" -ForegroundColor White
Write-Host ""
Write-Host "2. 创建后，运行以下命令推送代码:" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/$RepoName.git" -ForegroundColor Gray
Write-Host "   git branch -M main" -ForegroundColor Gray
Write-Host "   git push -u origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "3. 在 GitHub 仓库页面:" -ForegroundColor White
Write-Host "   Settings -> Pages -> Source: 'Deploy from a branch'" -ForegroundColor White
Write-Host "   Branch: main, / (root) -> Save" -ForegroundColor White
Write-Host ""
Write-Host "4. 等待 1-2 分钟，你的公网链接就是:" -ForegroundColor White
Write-Host "   https://YOUR_USERNAME.github.io/$RepoName/" -ForegroundColor Green
Write-Host ""
Write-Host "PWA 安装: 在 Chrome/Edge 打开链接后，地址栏右侧会出现安装图标" -ForegroundColor Cyan
