import assert from 'node:assert/strict'
import { test } from 'node:test'
import { filterLinks, listCategories, matchesSearch, localDescription } from '../public/directory.js'

const links = [
  { slug: 'vast', title: 'Vast.ai', category: 'GPU', description: 'GPU cloud', description_zh: '模型训练和推理', code: '709915', tags: ['compute'] },
  { slug: 'ai-galaxy', title: '智星云 AI Galaxy', category: 'GPU', code: 'CE2269', tags: ['ai'] },
  { slug: 'zai', title: 'Z.ai', category: 'AI', description_en: 'Coding tools', featured: true },
  { slug: 'misc', title: 'Other tool', category: '' },
  { slug: 'new', title: 'A new category', category: 'Design' }
]

test('search matches Chinese descriptions, translated categories, referral codes and multiple terms', () => {
  assert.equal(matchesSearch(links[0], '模型'), true)
  assert.equal(matchesSearch(links[0], '算力 709915'), true)
  assert.equal(matchesSearch(links[1], '  galaxy ce2269  '), true)
  assert.equal(matchesSearch(links[0], 'gpu nonexistent'), false)
  assert.equal(matchesSearch(links[2], 'coding'), true)
})

test('category and search combine without changing source data', () => {
  const originalOrder = links.map(link => link.slug)
  assert.deepEqual(filterLinks(links, { category: 'GPU', search: 'ce2269' }).map(link => link.slug), ['ai-galaxy'])
  assert.equal(filterLinks(links, { category: 'AI', search: 'ce2269' }).length, 0)
  assert.equal(filterLinks(links)[0].slug, 'zai')
  assert.deepEqual(links.map(link => link.slug), originalOrder)
})

test('navigation includes new and uncategorized resources with accurate counts', () => {
  const categories = listCategories(links)
  assert.equal(categories.reduce((sum, category) => sum + category.count, 0), links.length)
  assert.equal(categories.find(category => category.value === 'GPU').count, 2)
  assert.equal(categories.find(category => category.value === 'Design').en, 'Design')
  assert.equal(categories.find(category => category.value === '').zh, '其他资源')
  assert.equal(filterLinks(links, { category: '' })[0].slug, 'misc')
})

test('localized descriptions fall back without losing content', () => {
  assert.equal(localDescription(links[0], 'zh'), '模型训练和推理')
  assert.equal(localDescription(links[0], 'en'), 'GPU cloud')
  assert.equal(localDescription(links[1], 'en'), '')
})
