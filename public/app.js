import { categoryInfo, listCategories, filterLinks, localDescription } from './directory.js'

const I18N = {
  zh: {
    skip: '跳至资源列表', browse: '浏览分类', curated: '好用的，才收录。',
    sidebarNote: '给每个值得收藏的工具，一个更近的入口。', home: '烁皓的个人主页',
    directory: '精选工具导航', eyebrow: '少一点寻找，多一点创造', headline: '好工具，',
    headlineAccent: '随手可达。', intro: '从灵感到上线，找到你需要的下一件工具。',
    resources: '精选资源', categories: '实用分类', all: '全部资源', reset: '重置筛选',
    collectionHint: '为你的下一次创造，准备就绪', contact: '联系我 ↗',
    search: '搜索工具、关键词或推荐码…', clear: '清空搜索', visit: '访问',
    copyLink: '复制短链', copyCode: '复制推荐码', copied: '短链已复制', codeCopied: '推荐码已复制',
    copyError: '复制失败，请检查浏览器的剪贴板权限。', featured: '精选',
    empty: '没有找到匹配的工具', emptyHint: '试试其他关键词，或重置筛选查看全部资源。',
    loading: '正在加载资源…', loadError: '资源暂时无法加载', loadErrorHint: '请检查网络连接，然后重试。',
    retry: '重新加载', results: '个资源', light: '浅色模式', dark: '深色模式', system: '跟随系统'
  },
  en: {
    skip: 'Skip to resources', browse: 'Categories', curated: 'Useful things, collected.',
    sidebarNote: 'A shorter path to tools worth keeping.', home: 'My personal website',
    directory: 'The resource collection', eyebrow: 'LESS SEARCHING. MORE CREATING.', headline: 'Good tools. ',
    headlineAccent: 'Within reach.', intro: 'From first idea to launch. Find your next go-to tool.',
    resources: 'Resources', categories: 'Categories', all: 'All resources', reset: 'Reset filters',
    collectionHint: 'Ready for whatever you make next', contact: 'Contact ↗',
    search: 'Search tools, keywords, or referral codes…', clear: 'Clear search', visit: 'Visit',
    copyLink: 'Copy shortlink', copyCode: 'Copy referral code', copied: 'Shortlink copied', codeCopied: 'Referral code copied',
    copyError: 'Copy failed. Please check clipboard permissions.', featured: 'Featured',
    empty: 'No matching tools', emptyHint: 'Try another keyword, or reset filters to see all resources.',
    loading: 'Loading resources…', loadError: 'Resources could not be loaded', loadErrorHint: 'Check your connection and try again.',
    retry: 'Try again', results: 'resources', light: 'Light theme', dark: 'Dark theme', system: 'System theme'
  }
}

const ICONS = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  sparkles: '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3ZM20 2v4m-2-2h4"/>',
  chip: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M9 3v3m6-3v3m-6 12v3m6-3v3M3 9h3m-3 6h3m12-6h3m-3 6h3"/>',
  server: '<rect x="3" y="3" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="7" rx="2"/><path d="M7 6.5h.01M7 17.5h.01M12 6.5h5m-5 11h5"/>',
  database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0"/>',
  globe: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
  wallet: '<path d="M20 8V5a2 2 0 0 0-2-2L4 6v14h16V8H4M16 12h5v4h-5z"/>',
  megaphone: '<path d="m3 10 18-6v16L3 14v-4Zm4 5 2 6h4l-2-5M16 6v12"/>',
  folder: '<path d="M3 7V4h7l2 3h9v13H3V7Z"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 4H6a2 2 0 0 0-2 2v10"/>',
  code: '<path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-12-2 14"/>',
  arrow: '<path d="M7 17 17 7H7m10 0v10"/>',
  light: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
  dark: '<path d="M20.5 13a8.5 8.5 0 1 1-9.5-9.5A7 7 0 0 0 20.5 13Z"/>',
  system: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8m-4-4v4"/>'
}
const icon = name => `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ICONS.folder}</svg>`
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;')
const $ = selector => document.querySelector(selector)
const storage = {
  get(key) { try { return localStorage.getItem(key) } catch { return null } },
  set(key, value) { try { localStorage.setItem(key, value) } catch {} }
}
const initialQuery = new URLSearchParams(location.search)
const state = { links: [], category: initialQuery.get('category'), search: initialQuery.get('q') || '', loading: true, error: false }
const savedLang = storage.get('link-hao-lang')
let language = Object.hasOwn(I18N, savedLang) ? savedLang : ((navigator.language || '').startsWith('en') ? 'en' : 'zh')
let theme = storage.get('link-hao-theme') || 'system'
if (!['light', 'dark', 'system'].includes(theme)) theme = 'system'
const t = key => I18N[language][key]
const searchEl = $('#search')
const linksEl = $('#links')
const navEl = $('#categories')
let toastTimer

function applyTheme() {
  document.documentElement.dataset.theme = theme === 'dark' || (theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light'
  document.querySelectorAll('[data-theme-value]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.themeValue === theme))
  })
}

function applyLanguage() {
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en'
  document.title = language === 'zh' ? 'link.79px.com · 好工具，随手可达' : 'link.79px.com · Good tools. Within reach.'
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n) })
  document.querySelectorAll('[data-lang]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === language)))
  document.querySelectorAll('[data-theme-value]').forEach(button => {
    button.title = t(button.dataset.themeValue)
    button.setAttribute('aria-label', button.title)
  })
  searchEl.placeholder = t('search')
  searchEl.setAttribute('aria-label', t('search'))
  $('#clearSearch').setAttribute('aria-label', t('clear'))
  navEl.setAttribute('aria-label', t('browse'))
  $('.collection-stats').setAttribute('aria-label', t('resources'))
  renderNavigation()
  render()
}

function renderNavigation() {
  const categories = listCategories(state.links)
  const entries = [{ value: null, count: state.links.length, [language]: t('all'), icon: 'grid' }, ...categories]
  navEl.replaceChildren(...entries.map(category => {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'nav-item'
    button.innerHTML = `${icon(category.icon)}<span>${esc(category[language])}</span><span class="nav-count">${category.count}</span>`
    button.dataset.category = category.value === null ? '__all__' : category.value
    button.addEventListener('click', () => {
      state.category = category.value
      updateQuery()
      render()
    })
    return button
  }))
  $('#totalCount').textContent = state.loading ? '—' : state.links.length
  $('#categoryCount').textContent = state.loading ? '—' : categories.length
}

function updateQuery() {
  const url = new URL(location.href)
  if (state.category !== null) url.searchParams.set('category', state.category)
  else url.searchParams.delete('category')
  if (state.search.trim()) url.searchParams.set('q', state.search.trim())
  else url.searchParams.delete('q')
  history.replaceState(null, '', url)
}

function resetFilters() {
  state.category = null
  state.search = ''
  searchEl.value = ''
  updateQuery()
  render()
  searchEl.focus()
}

function renderMessage(title, detail, action, handler) {
  const el = document.createElement('div')
  el.className = 'empty-state'
  el.innerHTML = `${icon('search')}<h3>${esc(title)}</h3>${detail ? `<p>${esc(detail)}</p>` : ''}${action ? `<button type="button" class="text-button">${esc(action)}</button>` : ''}`
  if (handler) el.querySelector('button').addEventListener('click', handler)
  linksEl.replaceChildren(el)
}

function render() {
  const visible = filterLinks(state.links, state)
  const filtered = state.category !== null || Boolean(state.search.trim())
  $('#collectionTitle').textContent = state.category === null ? t('all') : categoryInfo(state.category)[language]
  $('#visibleCount').textContent = state.loading ? '—' : visible.length
  $('#clearSearch').hidden = !state.search
  $('#resetFilters').hidden = !filtered
  $('#collectionHint').hidden = filtered
  navEl.querySelectorAll('button').forEach(button => {
    const selected = button.dataset.category === (state.category === null ? '__all__' : state.category)
    button.classList.toggle('active', selected)
    button.setAttribute('aria-pressed', String(selected))
  })
  linksEl.setAttribute('aria-busy', String(state.loading))
  if (state.loading) return renderMessage(t('loading'))
  $('#resultAnnouncement').textContent = state.error ? t('loadError') : `${visible.length} ${t('results')}`
  if (state.error) return renderMessage(t('loadError'), t('loadErrorHint'), t('retry'), loadLinks)
  if (!visible.length) return renderMessage(t('empty'), t('emptyHint'), t('reset'), resetFilters)
  linksEl.replaceChildren(...visible.map(renderCard))
}

function renderCard(link) {
  const el = document.createElement('article')
  const category = categoryInfo(link.category)
  const title = link.title || link.slug
  const monograms = { 'ai-galaxy': '星', anyrouter: 'Ar', bandwagonhost: 'BW', chatcut: 'Cc', cliproxy: 'Cp', dmit: 'D', hncloud: '华', neon: 'N', racknerd: 'RN', rentuibang: '推', vast: 'V', wise: 'W', xiangongyun: '仙', 'xfyun-maas': '讯', 'xiaomi-mimo': 'Mi', zai: 'Z' }
  el.className = `link-card tone-${category.tone}`
  el.innerHTML = `
    <a class="card-top" href="${esc(link.shortPath)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(t('visit'))}: ${esc(title)}">
      <span class="resource-icon" aria-hidden="true">${esc(monograms[link.slug] || title.slice(0, 2))}</span>
      <div class="card-title">
        <h3>${esc(title)}${link.featured ? `<span class="featured-mark" title="${esc(t('featured'))}" aria-label="${esc(t('featured'))}">✳</span>` : ''}</h3>
        <span class="card-category">${esc(category[language])}</span>
      </div>
    </a>
    <p class="description" title="${esc(localDescription(link, language))}">${esc(localDescription(link, language))}</p>
    <div class="tags">${(link.tags || []).map(tag => `<span class="tag">${esc(tag)}</span>`).join('')}</div>
    <div class="card-footer">
      <div class="card-meta">${link.code
        ? `<button type="button" class="code-button" data-action="copy-code" title="${esc(t('copyCode'))}: ${esc(link.code)}" aria-label="${esc(t('copyCode'))}: ${esc(link.code)}">${icon('code')}<code>${esc(link.code)}</code></button>`
        : `<span class="short-path" title="${esc(link.shortPath)}">${esc(link.shortPath)}</span>`}</div>
      <button type="button" class="copy-button" data-action="copy-link" title="${esc(t('copyLink'))}" aria-label="${esc(t('copyLink'))}: ${esc(title)}">${icon('copy')}</button>
      <a class="visit-button" href="${esc(link.shortPath)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(t('visit'))}: ${esc(title)}">${esc(t('visit'))}${icon('arrow')}</a>
    </div>`
  el.querySelector('[data-action="copy-link"]').addEventListener('click', () => copy(new URL(link.shortPath, location.origin).href, 'copied'))
  el.querySelector('[data-action="copy-code"]')?.addEventListener('click', () => copy(String(link.code), 'codeCopied'))
  return el
}

async function copy(value, message) {
  try {
    await navigator.clipboard.writeText(value)
    showToast(t(message))
  } catch {
    showToast(t('copyError'))
  }
}

function showToast(message) {
  const toast = $('#toast')
  toast.textContent = message
  toast.classList.add('show')
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800)
}

async function loadLinks() {
  state.loading = true
  state.error = false
  render()
  try {
    const response = await fetch('/map.json')
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const links = await response.json()
    if (!Array.isArray(links)) throw new Error('Invalid directory')
    state.links = links
    if (state.category !== null && !links.some(link => (link.category || '') === state.category)) {
      state.category = null
      updateQuery()
    }
  } catch {
    state.error = true
  } finally {
    state.loading = false
    renderNavigation()
    render()
  }
}

searchEl.value = state.search
searchEl.addEventListener('input', () => {
  state.search = searchEl.value
  updateQuery()
  render()
})
$('#clearSearch').addEventListener('click', () => {
  state.search = ''
  searchEl.value = ''
  updateQuery()
  render()
  searchEl.focus()
})
$('#resetFilters').addEventListener('click', resetFilters)
document.addEventListener('keydown', event => {
  if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey && !event.target.closest('input, textarea, [contenteditable="true"]')) {
    event.preventDefault()
    searchEl.focus()
  }
  if (event.key === 'Escape' && document.activeElement === searchEl) $('#clearSearch').click()
})
document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click', () => {
  language = button.dataset.lang
  storage.set('link-hao-lang', language)
  applyLanguage()
}))
document.querySelectorAll('[data-theme-value]').forEach(button => {
  button.innerHTML = icon(button.dataset.themeValue)
  button.addEventListener('click', () => {
    theme = button.dataset.themeValue
    storage.set('link-hao-theme', theme)
    applyTheme()
  })
})
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (theme === 'system') applyTheme() })
window.addEventListener('popstate', () => {
  const query = new URLSearchParams(location.search)
  state.category = query.get('category')
  state.search = query.get('q') || ''
  searchEl.value = state.search
  render()
})
$('#searchIcon').innerHTML = icon('search')
applyTheme()
applyLanguage()
loadLinks()
