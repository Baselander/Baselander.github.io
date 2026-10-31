/**
 * 她 · 官网脚本（2026-10-29）
 *
 * 零依赖、不联网。六件小事：
 *   ① 导航滚动后收紧                ② 顶部滚动进度
 *   ③ 元素进入视口时淡入（IntersectionObserver）
 *   ④ 数字滚动                      ⑤ 卡片光斑跟着鼠标 / 她随鼠标轻微视差
 *   ⑥ 鲸鱼粒子（canvas，很轻）
 *   ⑦ **可选增强**：如果这一页是"http(s):// 打开的"，就加载真 Live2D 让她在首屏动起来；
 *      加载失败（双击 file:// 打开、缺文件、WebGL 不可用）→ 静默留在静态图，什么都不报错。
 */

;(function () {
  'use strict'

  /**
   * ── 下载 / 仓库 / 反馈（2026-10-31 填实）────────────────────────────────
   *   DOWNLOAD_URL：指向 GitHub 的「latest release」—— 以后传新版本这里**不用再改**。
   *   REPO_URL    ：开源壳的仓库（形象/声库不随仓库分发）。
   *   FEEDBACK_EMAIL：反馈邮箱，页面上会变成可点的 mailto。
   */
  const DOWNLOAD_URL = 'https://github.com/Baselander/AURORA-3.3/releases/latest'
  const REPO_URL = 'https://github.com/Baselander/AURORA-3.3'
  const FEEDBACK_EMAIL = 'baselander@outlook.com'

  const $ = (s) => document.querySelector(s)
  const $$ = (s) => Array.from(document.querySelectorAll(s))
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  /* ── ① 导航收紧 ─────────────────────────────────────────────────────── */
  const nav = $('#nav')
  const progress = $('#progress')
  const onScroll = () => {
    const y = window.scrollY || 0
    if (nav) nav.classList.toggle('is-stuck', y > 24)
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight
      progress.style.width = (h > 0 ? Math.min(100, (y / h) * 100) : 0) + '%'
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  /* ── ③ 进入视口淡入 ─────────────────────────────────────────────────── */
  const revealEls = $$('[data-reveal]')
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const el = e.target
          // 同一个卡片群稍微错开一点，看着像"一起浮上来"
          const idx = Number(el.dataset.delay || 0)
          el.style.transitionDelay = Math.min(240, idx * 60) + 'ms'
          el.classList.add('in')
          io.unobserve(el)
        }
      },
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
    )
    revealEls.forEach((el, i) => {
      if (!el.dataset.delay && el.parentElement) el.dataset.delay = String(i % 4)
      io.observe(el)
    })
  } else {
    revealEls.forEach((el) => el.classList.add('in'))
  }

  /* ── ④ 数字滚动 ─────────────────────────────────────────────────────── */
  const nums = $$('[data-count]')
  const animateNum = (el) => {
    const target = Number(el.dataset.count) || 0
    if (reduce) {
      el.textContent = String(target)
      return
    }
    const dur = 1100
    const t0 = performance.now()
    const fmt = (v) => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / dur)
      // easeOutCubic
      el.textContent = fmt(target * (1 - Math.pow(1 - k, 3)))
      if (k < 1) requestAnimationFrame(tick)
      else el.textContent = fmt(target)
    }
    requestAnimationFrame(tick)
  }
  if ('IntersectionObserver' in window) {
    const io2 = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          animateNum(e.target)
          io2.unobserve(e.target)
        }
      },
      { threshold: 0.6 },
    )
    nums.forEach((n) => io2.observe(n))
  } else {
    nums.forEach(animateNum)
  }

  /* ── ⑤ 鼠标：跟光 + 卡片光斑 + 她视差 ───────────────────────────────── */
  const herWrap = $('#herWrap')
  let raf = 0
  let lastX = 0
  let lastY = 0
  window.addEventListener(
    'pointermove',
    (e) => {
      lastX = e.clientX
      lastY = e.clientY
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const px = (lastX / window.innerWidth) * 100
        const py = (lastY / window.innerHeight) * 100
        document.documentElement.style.setProperty('--mx', px + '%')
        document.documentElement.style.setProperty('--my', py + '%')
        if (herWrap && !reduce) {
          // 她跟着鼠标微微动（视野里的视差，不是乱晃）
          const dx = (lastX / window.innerWidth - 0.5) * 14
          const dy = (lastY / window.innerHeight - 0.5) * 8
          herWrap.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0)`
        }
      })
    },
    { passive: true },
  )

  $$('.card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect()
      card.style.setProperty('--cx', ((e.clientX - r.left) / r.width) * 100 + '%')
      card.style.setProperty('--cy', ((e.clientY - r.top) / r.height) * 100 + '%')
    })
  })

  /* ── ⑥ 鲸鱼粒子（很轻：40 个点，慢速上浮 + 呼吸） ───────────────────── */
  ;(function particles() {
    const cv = $('#particles')
    if (!cv || reduce) return
    const ctx = cv.getContext('2d')
    if (!ctx) return
    let w = 0
    let h = 0
    let dpr = 1
    const N = 40
    const pts = []
    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1)
      w = cv.width = Math.floor(window.innerWidth * dpr)
      h = cv.height = Math.floor(window.innerHeight * dpr)
      cv.style.width = window.innerWidth + 'px'
      cv.style.height = window.innerHeight + 'px'
    }
    const seed = () => {
      pts.length = 0
      for (let i = 0; i < N; i++) {
        pts.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: (0.6 + Math.random() * 1.8) * dpr,
          vy: (0.06 + Math.random() * 0.22) * dpr,
          vx: (Math.random() - 0.5) * 0.12 * dpr,
          a: 0.12 + Math.random() * 0.4,
          ph: Math.random() * Math.PI * 2,
        })
      }
    }
    resize()
    seed()
    window.addEventListener('resize', () => {
      resize()
      seed()
    })
    let t = 0
    const draw = () => {
      t += 0.016
      ctx.clearRect(0, 0, w, h)
      for (const p of pts) {
        p.y -= p.vy
        p.x += p.vx + Math.sin(t + p.ph) * 0.08 * dpr
        if (p.y < -10) {
          p.y = h + 10
          p.x = Math.random() * w
        }
        const a = p.a * (0.7 + 0.3 * Math.sin(t * 1.4 + p.ph))
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(159,208,255,${a.toFixed(3)})`
        ctx.fill()
      }
      requestAnimationFrame(draw)
    }
    requestAnimationFrame(draw)
  })()

  /* ── ⑦ 可选：真 Live2D（按钮触发；只在 http(s) 下可用） ─────────────── */
  /**
   * 为什么默认不自动加载：
   *   ① 双击 index.html（file://）时 fetch 模型会被浏览器拦，本来就加载不了；
   *   ② 模型是"整张书桌场景"（画布 4068×4068，她自己只占中间一条），缩放到页面里的取景
   *      需要按她的实际占位来算 —— 这一步我（写页面的）没法用眼睛校，交给你按一下按钮来看。
   *      不合适就永远用静态图（默认就是静态图，最稳）。
   */
  const stage = $('#stage')
  const canvas = $('#live2d')
  const liveBtn = $('#liveBtn')
  const wantStatic = /(\?|&)static=1/.test(location.search)
  const isHttp = /^https?:$/.test(location.protocol)
  let liveTried = false
  // 取景微调（不想改代码就靠这两个参数）：?live=1&lh=0.8&dy=0.06
  //   lh = 她占舞台高度的比例（默认 0.95；觉得太大就 0.75，太小就 1.0）
  //   dy = 整体往下挪多少（占舞台高度的比例，默认 0.01，即底部贴边）
  const qs = new URLSearchParams(location.search)
  const LH = (() => {
    const v = Number(qs.get('lh'))
    return Number.isFinite(v) && v > 0.2 && v < 2 ? v : 0.95
  })()
  const DY = (() => {
    const v = Number(qs.get('dy'))
    return Number.isFinite(v) && v >= -0.5 && v <= 0.5 ? v : 0.01
  })()

  const loadScript = (src) =>
    new Promise((resolve, reject) => {
      const s = document.createElement('script')
      s.src = src
      s.async = false
      s.onload = () => resolve(true)
      s.onerror = () => reject(new Error('加载失败：' + src))
      document.head.appendChild(s)
    })

  function setLiveBtn(text, tone) {
    if (!liveBtn) return
    liveBtn.textContent = text
    liveBtn.disabled = tone === 'busy' || tone === 'dead'
  }

  async function bootLive2D() {
    if (!stage || !canvas || liveTried) return
    liveTried = true
    if (!isHttp) {
      setLiveBtn('要起本地服务才能动（看下面）', 'dead')
      return
    }
    const BASE = 'assets/live2d'
    setLiveBtn('她正在活动…', 'busy')
    try {
      const probe = await fetch(BASE + '/model/c_0120.model3.json', { cache: 'no-cache' })
      if (!probe.ok) throw new Error('没有模型文件')
      await probe.json()

      if (!window.Live2DCubismCore) await loadScript(BASE + '/vendor/live2dcubismcore.min.js')
      if (!window.PIXI) await loadScript(BASE + '/vendor/pixi.min.js')
      if (!window.PIXI || !window.PIXI.live2d) await loadScript(BASE + '/vendor/cubism4.min.js')
      if (!window.PIXI || !window.PIXI.live2d) throw new Error('运行时没起来')

      const { Live2DModel } = window.PIXI.live2d
      const app = new window.PIXI.Application({
        view: canvas,
        width: 8,
        height: 8,
        backgroundAlpha: 0,
        antialias: true,
        autoDensity: true,
        resolution: Math.min(2, window.devicePixelRatio || 1),
        powerPreference: 'low-power',
      })
      app.ticker.maxFPS = 30

      const model = await Live2DModel.from(BASE + '/model/c_0120.model3.json', {
        autoInteract: false,
        autoUpdate: true,
        idleMotionGroup: 'idle',
      })
      model.eventMode = 'none'
      app.stage.addChild(model)

      const im = model.internalModel
      const baseW = im.width || im.originalWidth || 1
      const baseH = im.height || im.originalHeight || 1
      // ⚠️ 量"画布现在多大"要用**外面的容器**，不能用 canvas 自己：
      //   PIXI 初始化时会把 canvas 的 inline 宽高写成 8px，getBoundingClientRect() 读到就是 8 → 被 clamp 成 64，
      //   结果首屏她只有指甲盖大（踩过：canvas.width 量出来 128）。
      const host = document.querySelector('.her-wrap') || stage

      /**
       * "她自己占画布的哪一块"（本地坐标，和缩放无关，只要量一次）。
       * 为什么要量：这个模型的画布是 4068×4068 的正方形，她在里面只占一小块（实测不透明像素才 6%）。
       *   只按画布大小缩放 → 她会变成"指甲盖大的一小撮"。
       * 做法：把模型单独抽成位图 → 缩到 256 扫一遍 alpha 包围盒（快，且缩小时用 nearest 保证阈值不糊）。
       */
      let CONTENT = null
      const measureLocal = () => {
        try {
          const P = window.PIXI
          const src = app.renderer.extract.canvas(model)
          const sw = src.width
          const sh = src.height
          const N = 256
          const k = Math.max(1, Math.ceil(Math.max(sw, sh) / N))
          const tmp = document.createElement('canvas')
          tmp.width = Math.max(1, Math.floor(sw / k))
          tmp.height = Math.max(1, Math.floor(sh / k))
          const ctx = tmp.getContext('2d', { willReadFrequently: true })
          ctx.imageSmoothingEnabled = false
          ctx.drawImage(src, 0, 0, tmp.width, tmp.height)
          const d = ctx.getImageData(0, 0, tmp.width, tmp.height).data
          let x0 = tmp.width
          let y0 = tmp.height
          let x1 = -1
          let y1 = -1
          for (let y = 0; y < tmp.height; y++) {
            for (let x = 0; x < tmp.width; x++) {
              if (d[(y * tmp.width + x) * 4 + 3] > 24) {
                if (x < x0) x0 = x
                if (x > x1) x1 = x
                if (y < y0) y0 = y
                if (y > y1) y1 = y
              }
            }
          }
          if (x1 < 0) return null
          const u = k // 一个扫描像素 = k 个本地单位
          void P
          return { lx: x0 * u, ly: y0 * u, lw: (x1 - x0 + 1) * u, lh: (y1 - y0 + 1) * u, srcW: sw, srcH: sh }
        } catch (err) {
          console.info('[她] 量不到她的实际占位，按整张画布处理：', (err && err.message) || err)
          return null
        }
      }

      const fit = () => {
        const box = host.getBoundingClientRect()
        const W = Math.max(120, Math.round(box.width))
        const H = Math.max(160, Math.round(box.height))
        app.renderer.resize(W, H)
        const res = (app.renderer && app.renderer.resolution) || 1
        if (!CONTENT) CONTENT = measureLocal()

        // ① 按"她实际有多高"定 scale：CSS 尺寸 = 本地单位 × scale ÷ resolution（实测这组关系）
        const lh = CONTENT && CONTENT.lh > 1 ? CONTENT.lh : baseH
        const s = Math.max(0.01, Math.min(30, ((H * LH) * res) / lh))
        model.scale.set(s)
        model.anchor.set(0, 0)
        model.position.set(0, 0)
        try {
          if (typeof model.updateTransform === 'function') model.updateTransform()
        } catch {}

        // ② 把"她那一块"摆到舞台中间偏下：拿世界变换把本地包围盒的两个角换算到屏幕坐标，
        //    再整体平移 —— 这比猜 anchor 靠谱（Live2D 的绘制原点不在围盒角上）
        if (CONTENT) {
          const P = window.PIXI
          const toScreen = (x, y) => {
            try {
              const p = model.worldTransform.apply(new P.Point(x, y))
              return { x: p.x, y: p.y }
            } catch {
              return { x, y }
            }
          }
          const tl = toScreen(CONTENT.lx, CONTENT.ly)
          const br = toScreen(CONTENT.lx + CONTENT.lw, CONTENT.ly + CONTENT.lh)
          const dx = W / 2 - (tl.x + br.x) / 2
          const dy = H * (1 - DY) - br.y
          model.position.set(model.position.x + dx, model.position.y + dy)
        }
      }
      fit()
      window.addEventListener('resize', fit)
      if ('ResizeObserver' in window) {
        try {
          new ResizeObserver(() => fit()).observe(host)
        } catch {}
      }

      // 视线跟着鼠标（她那套 focusController 的接口）
      try {
        const fc = im.focusController
        window.addEventListener(
          'pointermove',
          (e) => {
            const box = canvas.getBoundingClientRect()
            const nx = ((e.clientX - box.left) / box.width) * 2 - 1
            const ny = ((e.clientY - box.top) / box.height) * 2 - 1
            if (!fc) return
            fc.targetX = Math.max(-1, Math.min(1, nx))
            fc.targetY = Math.max(-1, Math.min(1, ny))
          },
          { passive: true },
        )
      } catch {}

      stage.classList.add('is-live')
      // 给自检/排查用（官网不需要，但量"她到底画多大"很方便）
      window.__stageModel = model
      window.__stageApp = app
      setLiveBtn('她在动（再点一下回静态图）', 'ok')
      liveBtn.dataset.on = '1'
      console.info('[她] Live2D 已在首屏加载')
    } catch (err) {
      // 静默回退到静态图：官网不该因为一个模型挂掉
      stage.classList.remove('is-live')
      setLiveBtn('动不了（还是静态图），控制台有原因', 'dead')
      console.info('[她] Live2D 没加载起来，留在静态图：', (err && err.message) || err)
    }
  }

  if (liveBtn) {
    liveBtn.addEventListener('click', () => {
      // 已经动起来了 → 再点一下切回静态图（她那张图也是真渲染出来的，静态并不亏）
      if (liveBtn.dataset.on === '1') {
        stage.classList.remove('is-live')
        liveBtn.dataset.on = ''
        setLiveBtn('让她动起来', 'ok')
        try {
          if (window.__stageApp) window.__stageApp.ticker.stop()
        } catch {}
        return
      }
      try {
        if (window.__stageApp) window.__stageApp.ticker.start()
      } catch {}
      void bootLive2D()
    })
  }
  // 想直接看动的：在地址后面加 ?live=1
  if (/(\?|&)live=1/.test(location.search) && !wantStatic) {
    if ('requestIdleCallback' in window) requestIdleCallback(() => void bootLive2D(), { timeout: 2500 })
    else setTimeout(() => void bootLive2D(), 900)
  }

  /**
   * ── 下载 / 仓库 / 反馈（2026-10-31 填实）────────────────────────────────
   *   下载按钮 → GitHub 的 latest release（以后传新包不用改这一页）
   *   「先看看她能做什么」那颗 ghost 换成「去 GitHub 看源码」
   *   再加两颗：反馈邮箱（mailto，主题/正文预填好）+ 页脚两条
   */
  const dl = $('#dlBtn')
  if (dl) {
    dl.href = DOWNLOAD_URL
    dl.setAttribute('rel', 'noopener')
  }
  const ghost = document.querySelector('#download .btn.ghost')
  if (ghost) {
    ghost.href = REPO_URL
    ghost.textContent = '去 GitHub 看源码'
    ghost.setAttribute('rel', 'noopener')
  }
  if (FEEDBACK_EMAIL) {
    const mailto =
      'mailto:' +
      FEEDBACK_EMAIL +
      '?subject=' +
      encodeURIComponent('AURORA 反馈') +
      '&body=' +
      encodeURIComponent('我遇到的情况：\n\n\n（如果是 bug，写上：她做了什么、你期望她做什么、Windows 版本）')
    // 页面上已经有静态的 mailto 链接（没 JS 也能点）；这里只把"反馈"这条补到 FAQ 和页脚
    const mk = (text, cls) => {
      const a = document.createElement('a')
      a.className = cls
      a.href = mailto
      a.textContent = text
      a.title = '写信给 ' + FEEDBACK_EMAIL
      return a
    }
    // FAQ 末尾补一条"有问题找谁"
    const faq = document.querySelector('#faq .faq')
    if (faq && !document.getElementById('faq-feedback')) {
      const d = document.createElement('details')
      d.id = 'faq-feedback'
      const s = document.createElement('summary')
      s.textContent = '有问题、想提需求、想骂作者？'
      const p = document.createElement('p')
      p.appendChild(document.createTextNode('写信到 '))
      const a = document.createElement('a')
      a.href = mailto
      a.textContent = FEEDBACK_EMAIL
      p.appendChild(a)
      p.appendChild(
        document.createTextNode(
          '，或者在 GitHub 仓库开一个 Issue。说清"她做了什么 / 你期望她做什么 / Windows 版本"，回得最快。',
        ),
      )
      d.append(s, p)
      faq.appendChild(d)
    }
    // 页脚：如果静态 HTML 里还没这一条，补上
    const footLinks = document.querySelector('footer .foot div:last-child')
    if (footLinks && !/baselander@outlook\.com/.test(footLinks.textContent || '')) footLinks.appendChild(mk('反馈邮箱', ''))
  }
  // 页脚的年份别写死
  const yearEl = document.querySelector('#footYear')
  if (yearEl) yearEl.textContent = String(new Date().getFullYear())
})()
