export const CATEGORIES = {
  AI: { zh: 'AI 工具', en: 'AI tools', icon: 'sparkles', tone: 'ai' },
  GPU: { zh: 'GPU 算力', en: 'GPU compute', icon: 'chip', tone: 'gpu' },
  VPS: { zh: '云服务器', en: 'Cloud servers', icon: 'server', tone: 'vps' },
  Database: { zh: '数据库', en: 'Databases', icon: 'database', tone: 'database' },
  Proxy: { zh: '网络代理', en: 'Proxies', icon: 'globe', tone: 'proxy' },
  Finance: { zh: '财务支付', en: 'Finance', icon: 'wallet', tone: 'finance' },
  Promotion: { zh: '推广平台', en: 'Promotion', icon: 'megaphone', tone: 'promotion' }
}

export function categoryInfo(category) {
  return Object.hasOwn(CATEGORIES, category)
    ? CATEGORIES[category]
    : { zh: category || '其他资源', en: category || 'Other resources', icon: 'folder', tone: 'other' }
}

export function listCategories(links) {
  const counts = new Map()
  for (const link of links) {
    const category = link.category || ''
    counts.set(category, (counts.get(category) || 0) + 1)
  }
  const order = Object.keys(CATEGORIES)
  const rank = category => order.includes(category) ? order.indexOf(category) : order.length
  return [...counts].map(([value, count]) => ({ value, count, ...categoryInfo(value) }))
    .sort((a, b) => rank(a.value) - rank(b.value) || a.value.localeCompare(b.value))
}

export function matchesSearch(link, query) {
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean)
  const category = categoryInfo(link.category)
  const text = [link.slug, link.title, link.description, link.description_zh,
    link.description_en, link.url, link.category, category.zh, category.en,
    link.code, ...(link.tags || [])].filter(Boolean).join(' ').toLocaleLowerCase()
  return terms.every(term => text.includes(term))
}

export function filterLinks(links, { category = null, search = '' } = {}) {
  const order = Object.keys(CATEGORIES)
  const rank = link => order.includes(link.category) ? order.indexOf(link.category) : order.length
  return links.filter(link => (category === null || (link.category || '') === category) && matchesSearch(link, search))
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || rank(a) - rank(b) || a.slug.localeCompare(b.slug))
}

export function localDescription(link, language) {
  return link[`description_${language}`] || link.description || ''
}
