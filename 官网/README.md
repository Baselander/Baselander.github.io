# AURORA · 官网（静态单页）

一个**零依赖、零构建**的产品页：`index.html` + `assets\style.css` + `assets\site.js`。
配色沿用桌面版浮窗的「电光蓝」主题（主色 `#0047FF`、冰蓝 `#5B9BD5`、底色 `#080A17`）。

- 下载按钮 → `https://github.com/Baselander/AURORA-3.3/releases/latest`
- 仓库 / 反馈邮箱 → `https://github.com/Baselander/AURORA-3.3` / `baselander@outlook.com`
  （三个常量都在 `assets\site.js` 顶部：`DOWNLOAD_URL` / `REPO_URL` / `FEEDBACK_EMAIL`）

## 本地看

双击 `index.html` 就行（`file://` 打开，样式/动效全部正常）。整站不联网、不加载任何外部资源。

## 挂到 GitHub Pages

1. 把**本目录（`官网`）里的东西**放到仓库根（`index.html` 要在仓库第一层）。
2. 仓库 **Settings → Pages** → Source 选 `Deploy from a branch`，分支 `main`、目录 `/ (root)` → Save。
3. 等 1~2 分钟：`https://baselander.github.io/AURORA-3.3/`

**已经考虑过的事**

- 所有资源都是**相对路径**（`assets/...`），放在子目录下也能跑。
- `.nojekyll` 已加 —— 不然 GitHub 的 Jekyll 会跳过下划线开头的文件。

## ⚠️ 形象与授权（2026-10-31 改过一次）

首屏原来放的是**她的 Live2D 模型 + 立绘截图**，但那个形象是**第三方版权**，所以这一版：

- **删掉了** `assets\live2d\`（运行时 + 模型，约 4MB）和 `assets\hero-her.png`（渲染图）；
- 首屏换成**自己画的中性示意图**（index.html 里那段内联 SVG：海面 + 鲸尾 + 浮窗卡片，不含任何第三方素材）；
- 页脚「素材与授权」和 FAQ 里写清**三重署名**：上善无形（原作「溟月」）→ ZipZipPipe（女仆鲸鱼娘）→ 氵六青（Live2D 化），
  许可是 **CC BY-NC-SA 4.0（非商业）**；
- `assets\site.js` 里那段 Live2D 加载代码**留着没删**（历史 + 以后有授权模型可以直接接回），
  但现在页面里没有 `#live2d` / `#liveBtn` 这两个元素，所以它会立刻 return，什么都不会加载。

桌面应用那边仍然用那个模型（窗口要形象），署名写在**发行包**里：
`素材署名与授权.md` + `README.md` 的「素材署名」一节 + 模型目录自带的 `AUTHORS.md`。

## 目录

```
官网\
  index.html            单页（首屏是中性的内联 SVG 示意图）
  assets\style.css      样式（配色变量在最上面）
  assets\site.js        动效 + 下载/仓库/反馈链接 + 一段“有模型才加载”的 Live2D 代码
  serve.mjs             本地静态服务（零依赖；现在只是方便本地看）
  .nojekyll             GitHub Pages 用
  README.md             就是这份
```

## 改哪里

- 下载/仓库/邮箱：`assets\site.js` 顶部三个常量
- 配色：`assets\style.css` 顶部的 `:root` 变量（`--accent` / `--accent-hi` / `--ink-*`）
- 文案：`index.html`（中文直写，没有模板语言）
- 动效强度：`assets\site.js` 里各段都可单独关（`prefers-reduced-motion` 也会自动减弱）
