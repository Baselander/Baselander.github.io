/**
 * 官网\serve.mjs —— 零依赖的静态小服务（2026-10-29）
 *
 * 为什么要有它：官网里首屏的 Live2D 是"可选增强"——它要从 assets\live2d\ 里 fetch 模型，
 * 而浏览器用 file:// 打开时 fetch 会被拦（同源策略）。起这个小服务（http://127.0.0.1:8788）
 * 就能看到她真的在页面里动起来。不想要 Live2D 也无所谓：双击 index.html 一样能看全站。
 *
 * 用法：
 *   node serve.mjs            # 默认 127.0.0.1:8788
 *   node serve.mjs --port 9000
 *   Ctrl+C 停
 */

import http from 'node:http'
import { existsSync, readFileSync, statSync, createReadStream } from 'node:fs'
import { dirname, extname, join, normalize, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'

const HERE = dirname(fileURLToPath(import.meta.url))
const args = process.argv.slice(2)
const opt = (n, d) => {
  const i = args.indexOf(`--${n}`)
  return i >= 0 && args[i + 1] !== undefined ? args[i + 1] : d
}
const PORT = Number.parseInt(opt('port', process.env.SITE_PORT || '8788'), 10)

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json',
  '.moc3': 'application/octet-stream',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
}

function safeJoin(base, rel) {
  const cleaned = decodeURIComponent(rel).replace(/^\/+/, '').replace(/\\/g, '/')
  const abs = normalize(resolve(base, cleaned))
  if (abs !== base && !abs.startsWith(base + sep)) return null
  return abs
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || '/', `http://127.0.0.1:${PORT}`)
  let path = url.pathname
  if (path === '/' || path === '') path = '/index.html'
  const abs = safeJoin(HERE, path)
  if (!abs || !existsSync(abs) || statSync(abs).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('not found: ' + path)
    return
  }
  res.writeHead(200, {
    'Content-Type': MIME[extname(abs).toLowerCase()] || 'application/octet-stream',
    'Content-Length': String(statSync(abs).size),
    'Cache-Control': 'no-cache',
  })
  createReadStream(abs).pipe(res)
})

server.listen(PORT, '127.0.0.1', () => {
  const url = `http://127.0.0.1:${PORT}/`
  console.log(`官网：${url}`)
  console.log('（关掉这个窗口 / Ctrl+C 就停了）')
  try {
    const len = readFileSync(join(HERE, 'index.html'), 'utf8').length
    console.log(`index.html ${len} 字节，静态资源在 assets\\`)
  } catch {}
  // --open（或者 SITE_OPEN=1）：自己把浏览器叫起来（方便双击 cmd 的人）
  const shouldOpen = args.includes('--open') || process.env.SITE_OPEN === '1'
  if (shouldOpen) {
    try {
      spawn('cmd', ['/c', 'start', '', url], { detached: true, stdio: 'ignore', windowsHide: true }).unref()
    } catch (err) {
      console.log('（自己打开浏览器没成功，手动点上面那个地址也一样）')
    }
  }
})
