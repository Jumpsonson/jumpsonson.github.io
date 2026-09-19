# 个人职业作品集 · GitHub Pages

网站地址：https://jumpsonson.github.io/

源码仓库：https://github.com/Jumpsonson/jumpsonson.github.io

发布状态：https://github.com/Jumpsonson/jumpsonson.github.io/actions

这个仓库仅保存网站及其发布配置。使用 GitHub Pages 原生分支发布，每次成功推送到 `main` 后，GitHub 自动更新同一个网站地址，无需当前电脑持续开机或额外授予账户 workflow 权限。

## 首次发布

1. 将本目录作为一个独立 GitHub 仓库上传，默认分支为 `main`。
2. 仓库 Settings → Pages → Build and deployment → Source 选择 **Deploy from a branch**，分支 `main`，目录 `/ (root)`。
3. 向 `main` 提交修改，GitHub 自动运行 **pages build and deployment**。
4. 部署成功后，以部署记录和 Settings → Pages 显示的网址为准。

GitHub Free 使用公开仓库发布 Pages；付费账户可按套餐使用私有仓库。公开仓库的 HTML、照片、提交记录都可查看。父目录中的工作表、源资料与内部文件不属于此仓库。

## 日常更新

在本电脑修改 `index.html` 或 `assets` 中的素材后，在本目录运行：

```powershell
git add index.html assets
git commit -m "Update portfolio"
git push
```

推荐在开始编辑之前先执行 `git pull --ff-only`。如果出现冲突或未提交改动，先处理提示，不要强制推送覆盖云端版本。发布脚本或说明有修改时，另外添加对应文件后提交。

也可用 GitHub Desktop 完成 Pull、Commit 和 Push。仅保存本地文件不会触发上线；必须提交并推送到 GitHub。云端部署不需要此电脑持续开机。

## 换电脑继续更新

登录同一 GitHub 账户，从仓库页面复制 HTTPS 地址，用 GitHub Desktop 的 Clone 功能或 `git clone` 下载完整仓库，再修改、提交、推送。不要把旧电脑的整个工作资料目录上传。

```powershell
git clone https://github.com/Jumpsonson/jumpsonson.github.io.git
cd jumpsonson.github.io
```

少量文字可直接在 GitHub 网页打开 `index.html`，点击编辑并提交到 `main`。网页提交和其他电脑推送都会触发同一自动发布流程。

## 检查更新与恢复

- 在 Actions 查看本次运行是否成功；失败时点开错误日志修复，再提交。
- 发布完成后，访客重新打开或刷新原网址即可获取新内容。已经打开的页面不会被强制刷新。
- 若浏览器仍显示旧版，先确认对应提交部署成功，再强制刷新。GitHub Pages 缓存可能使更新稍有延迟。
- 如需撤回错误修改，用 `git revert <提交编号>` 创建恢复提交，再推送；不要用强制推送改写历史。
- Pages 在中国大陆的访问速度取决于运营商和网络状况，部署成功不代表所有地区均稳定可达。

## 发布实现

Pages 原生分支发布监听 `main` 根目录，`.nojekyll` 确保按原样发布 HTML 和图片。分享图片、canonical、og:url 已设为正式网址，未来换域名时需同步修改这几个字段。

可选本地检查（需要 Node.js，无第三方依赖）：

```powershell
$env:SITE_URL='https://jumpsonson.github.io/'
node scripts/build-pages.mjs --check
```

检查覆盖内联 JavaScript 语法和当前结构中的静态图片、imageSeries/imageList 图片及缩略图路径。原生分支发布不会运行本地检查脚本，较大修改后请主动检查，再推送。脚本不带 `--check` 时生成 `_site`；此目录不提交，也不参与 Pages 分支发布。脚本要求该输出目录不存在，本地重复生成前需清理此前的生成目录。

部署成功后，可验证公网首页及所有图片是否与本地版本一致：

```powershell
node scripts/verify-live.mjs
```

验证会读取正式网站，比较首页正文及图片 SHA-256；它不替代浏览器中的语言切换、弹窗和手机布局检查。
