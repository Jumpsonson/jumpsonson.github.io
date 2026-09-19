# Codex 项目上下文与新电脑接手文档

最后核对：2026-09-19

## 使用方法

本文件是本仓库的长期上下文入口。任何 Codex 会话在修改、发布或排查本网站之前，都应完整阅读本文件，再检查当前仓库和线上状态。历史记录用于解释既有决策；容易变化的信息必须重新验证。

新电脑上的建议首条指令：

> 请先完整阅读仓库根目录的 `AGENTS.md` 和 `README.md`，检查当前 Git 状态、远程仓库、GitHub Pages 设置及最新部署结果，然后继续处理我的网站更新任务。遵守文档中的公开范围、隐私要求、验证流程和非破坏性原则；不要凭历史快照假定当前部署仍然相同。

## 项目目标

这是张博思远（Jumpson）的中英韩职业作品集。网站面向公开访问，主要受众在中国大陆，也用于海外求职展示。维护目标是：任意电脑均可通过同一个 GitHub 仓库更新；推送到 `main` 后，GitHub Pages 自动更新固定网址。

## 当前公开部署

- 正式网站：https://jumpsonson.github.io/
- GitHub 仓库：https://github.com/Jumpsonson/jumpsonson.github.io
- GitHub 账户：`Jumpsonson`
- 默认及生产分支：`main`
- Pages 发布源：`Deploy from a branch`，`main`，`/ (root)`
- HTTPS：已强制启用
- 构建类型：GitHub Pages 原生分支发布（GitHub API 中为 `legacy`），没有自定义 Actions 工作流
- 初次部署验证提交：`c1037492a3f58cb80d3b4f53e98effcb328cf940`
- 后续自动更新验证提交：`75d9c785563457ee26b40433d2573e52fbe720a5`
- 上述两次 Pages 部署在 2026-09-19 均为 `success`；新会话必须重新查询最新结果

GitHub Pages 在中国大陆的可达性和速度会随地区、运营商和网络环境变化。部署成功仅说明 GitHub 已发布，不能代表所有中国大陆网络都稳定可达。

## 仓库结构

- `index.html`：网站主体；HTML、CSS、JavaScript 和三语文案集中在此文件
- `assets/img/`：公开展示素材；当前为 63 张正式 WebP 与 63 张缩略图，共 126 张
- `.nojekyll`：让 Pages 按静态文件原样发布；不要删除
- `.gitignore`：排除本地产物、环境文件、日志、临时文件及素材目录中的说明文本
- `scripts/build-pages.mjs`：本地语法和资源完整性检查；也能生成 `_site`，但 `_site` 不参与当前分支发布
- `scripts/verify-live.mjs`：检查线上首页和公开图片是否与本地文件一致
- `README.md`：面向维护者的简明操作说明
- `AGENTS.md`：本文件，面向未来 Codex 的完整项目上下文

本仓库是独立 Git 仓库。不要把其父目录中的 XLSX、需求文档、内部备注、原始照片或部署密钥加入本仓库。

## 内容与隐私边界

仓库和网站均为公开内容。提交前必须按“任何人都能查看和下载”的标准审查文件、Git 历史、图片和文案。

- 只修改用户明确授权的网站文件；默认不修改原始图片和父目录源资料
- 图片使用发布用 WebP 副本；保持正式图与 `-thumb.webp` 缩略图配对
- 不发布密码、API Token、Cookie、邮箱登录凭据、`.env` 或个人敏感文件
- 不公开内部商业指标，包括 GMV、净利润、margin、提货价、锁量及未授权的绝对销量
- 保持“已完成”和“规划中”项目的表述差异，不把计划写成已完成成果
- 中文是三语内容审核基准；韩文保持自然专业并以 `~했습니다` 为主，英文简洁自然，已完成工作优先用主动过去式
- 对外统计口径需能解释；不必要的第三方合作方和内部信息应匿名化

提交前可进行定向扫描。CSS 中存在正常的 `margin` 属性，因此不要把所有 `margin` 命中直接当作敏感数据；需结合 HTML/文案语境判断：

```powershell
rg -n -i "GMV|净利润|提货价|锁量|API[_ -]?key|secret|token|password" index.html assets README.md AGENTS.md
```

## 新电脑首次接手

1. 安装 Git；建议同时安装 GitHub CLI 或 GitHub Desktop。Node.js 用于本地检查脚本。
2. 登录 GitHub 账户 `Jumpsonson`。不要把密码或令牌写进仓库或发给 Codex。
3. 克隆仓库并进入目录：

```powershell
git clone https://github.com/Jumpsonson/jumpsonson.github.io.git
cd jumpsonson.github.io
```

4. 让 Codex 完整阅读 `AGENTS.md` 与 `README.md`，再执行只读检查：

```powershell
git status --short --branch
git remote -v
git log -3 --oneline
```

5. 确认 `origin` 指向 `https://github.com/Jumpsonson/jumpsonson.github.io.git`，当前分支跟踪 `origin/main`，工作区没有未知改动。
6. 如已安装 GitHub CLI，可核对 Pages 和最近部署；页面设置的预期值是 `main` 与 `/`：

```powershell
gh api repos/Jumpsonson/jumpsonson.github.io/pages
gh run list --repo Jumpsonson/jumpsonson.github.io --limit 3
```

GitHub Free 下本仓库为公开仓库，这是当前 GitHub Pages 发布方式的一部分。不要在未获得用户明确授权时改变仓库可见性、Pages 发布源、正式分支或网站地址。

## 每次更新的标准流程

开始编辑前：

```powershell
git status --short --branch
git pull --ff-only
```

如果 `git pull --ff-only` 因本地未提交改动、分叉或冲突而失败，先检查差异并保留用户已有修改。不要使用 `git reset --hard`、强制推送或覆盖式恢复。

完成网站修改后运行本地检查：

```powershell
$env:SITE_URL='https://jumpsonson.github.io/'
node scripts/build-pages.mjs --check
```

当前健康结果应包含 JavaScript 语法通过，以及资源引用全部存在。资源数量可能随以后增删图片变化，不能永远假定为 126；需结合本次修改核对。

提交时只添加本次任务涉及的文件，先检查暂存差异，再提交并推送：

```powershell
git add index.html assets README.md AGENTS.md scripts
git diff --cached --stat
git commit -m "Describe the website update"
git push
```

如果某些列出的路径本次未改变，Git 会忽略它们。不要用 `git add ..` 或从父目录批量加入文件。

推送后，等待 GitHub 自动生成的 `pages build and deployment` 完成。成功后运行：

```powershell
node scripts/verify-live.mjs
```

该脚本会比较线上与本地首页，并逐一校验公开图片的 SHA-256。它需要联网，只验证文件交付，不替代浏览器视觉和交互验收。

浏览器验收至少覆盖：桌面和手机宽度、中文/英文/韩文切换、导航、项目 Tab、详情弹窗、图片切换、主题切换、键盘可访问性和控制台错误。若浏览器或安全策略阻止实跑，应明确写明“浏览器验收未完成”，不能把静态检查或 HTTP 校验表述为完整验收。

## 自动发布的实际机制

当前没有 `.github/workflows/pages.yml`。GitHub Pages直接监听 `main` 根目录；任何电脑或 GitHub 网页只要向 `main` 成功提交，都会触发同一固定网址的自动更新。当前电脑无需开机。

部署初期曾尝试提交自定义 Pages 工作流，但登录令牌缺少 `workflow` 权限，GitHub 拒绝上传。随后采用原生分支发布并成功完成两次部署。除非新需求确实需要构建步骤，并且用户明确同意扩大相关权限，否则继续沿用原生分支发布。

父目录曾存在 EdgeOne 自动上传脚本。它不属于本仓库，也不参与当前 GitHub Pages 流程。不要同时运行两套部署方式来解释 GitHub Pages 的线上状态。

## URL、缓存与分享信息

`index.html` 中以下内容当前应使用正式 HTTPS 绝对地址：

- `og:image`
- `twitter:image`
- `og:url`
- `link rel="canonical"`

若未来更换 GitHub 用户名、自定义域名或仓库类型，必须同步更新这些字段、README、本文件和验证脚本默认地址。部署完成后访客重新打开或刷新即可看到新版；已经打开的页面不会被强制自动刷新，GitHub Pages 缓存也可能造成短暂延迟。

## 故障处理原则

- 部署失败：先看 GitHub Actions 中自动生成的 Pages 运行日志和失败提交
- 网站仍是旧版：核对本地 HEAD、`origin/main`、Pages 运行的 `headSha` 和线上文件；不要直接重复强制推送
- 图片缺失：检查大小写、相对路径、正式图与缩略图是否成对，并运行 `build-pages.mjs --check`
- 线上与本地不同：等待部署完成后重跑 `verify-live.mjs`，再区分缓存、发布失败和本地未推送
- 错误提交已上线：优先使用 `git revert <commit>` 创建可追溯的恢复提交，再推送
- `dubious ownership`：先确认确实是当前克隆目录，再对这个精确路径设置 Git `safe.directory`；不要把整个磁盘或宽泛目录设为安全目录

## 交付与记录要求

每次较大更新应报告：目标、具体修改、预期或实际结果、验证范围、线上地址、部署状态和仍未验证的事项。不得只报告“已完成”而省略浏览器、公网或隐私检查的边界。

当部署方式、网址、仓库、分支、检查命令、隐私口径或核心目录结构发生变化时，同步更新本文件并提交，让它继续作为新电脑的可靠上下文入口。

