import { afterEach, beforeEach, describe, expect, it } from '@jest/globals'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import type { CategoriesConfig, CategoryInfo } from '../types'

describe('categories', () => {
  let tempDir: string
  let skillsDir: string
  let categoriesFilePath: string

  beforeEach(async () => {
    tempDir = join(tmpdir(), `categories-test-${Date.now()}`)
    skillsDir = join(tempDir, 'skills')
    categoriesFilePath = join(skillsDir, 'categories.json')
    await mkdir(skillsDir, { recursive: true })
  })

  afterEach(async () => {
    try {
      await rm(tempDir, { recursive: true, force: true })
    } catch {
      // Ignore
    }
  })

  describe('CategoriesConfig type', () => {
    it('should have correct structure', () => {
      const config: CategoriesConfig = {
        categories: [{ id: 'test-category', name: 'Test Category', description: 'A test category', priority: 1 }],
        skills: { 'test-skill': 'test-category' },
      }
      expect(config.categories).toHaveLength(1)
      expect(config.categories[0].id).toBe('test-category')
      expect(config.skills['test-skill']).toBe('test-category')
    })

    it('should allow optional fields', () => {
      const category: CategoryInfo = { id: 'minimal', name: 'Minimal Category' }
      expect(category.description).toBeUndefined()
      expect(category.priority).toBeUndefined()
    })
  })

  describe('categories.json structure', () => {
    it('should parse valid categories.json', async () => {
      const validConfig: CategoriesConfig = {
        categories: [
          { id: 'development', name: 'Development', priority: 1 },
          { id: 'creation', name: 'Creation', priority: 2 },
        ],
        skills: { 'skill-a': 'development', 'skill-b': 'creation' },
      }
      await writeFile(categoriesFilePath, JSON.stringify(validConfig, null, 2))
      const content = await import('node:fs').then((fs) => fs.readFileSync(categoriesFilePath, 'utf-8'))
      const parsed = JSON.parse(content) as CategoriesConfig
      expect(parsed.categories).toHaveLength(2)
      expect(parsed.skills['skill-a']).toBe('development')
    })

    it('should handle empty categories', async () => {
      const emptyConfig: CategoriesConfig = { categories: [], skills: {} }
      await writeFile(categoriesFilePath, JSON.stringify(emptyConfig, null, 2))
      const content = await import('node:fs').then((fs) => fs.readFileSync(categoriesFilePath, 'utf-8'))
      const parsed = JSON.parse(content) as CategoriesConfig
      expect(parsed.categories).toHaveLength(0)
      expect(Object.keys(parsed.skills)).toHaveLength(0)
    })
  })

  describe('category priority sorting', () => {
    it('should sort categories by priority', () => {
      const categories: CategoryInfo[] = [
        { id: 'last', name: 'Last', priority: 100 },
        { id: 'first', name: 'First', priority: 1 },
        { id: 'middle', name: 'Middle', priority: 50 },
      ]
      const sorted = [...categories].sort((a, b) => (a.priority ?? 100) - (b.priority ?? 100))
      expect(sorted[0].id).toBe('first')
      expect(sorted[1].id).toBe('middle')
      expect(sorted[2].id).toBe('last')
    })

    it('should handle missing priority', () => {
      const categories: CategoryInfo[] = [
        { id: 'with-priority', name: 'With Priority', priority: 1 },
        { id: 'no-priority', name: 'No Priority' },
      ]
      const sorted = [...categories].sort((a, b) => (a.priority ?? 100) - (b.priority ?? 100))
      expect(sorted[0].id).toBe('with-priority')
      expect(sorted[1].id).toBe('no-priority')
    })
  })

  describe('skill to category mapping', () => {
    it('should map skills to categories', () => {
      const skillsMap: Record<string, string> = {
        'spec-driven-dev': 'development',
        'skill-creator': 'creation',
        'subagent-creator': 'creation',
      }
      expect(skillsMap['spec-driven-dev']).toBe('development')
      expect(skillsMap['skill-creator']).toBe('creation')
      expect(skillsMap['nonexistent']).toBeUndefined()
    })

    it('should return uncategorized for unknown skills', () => {
      const skillsMap: Record<string, string> = {}
      const DEFAULT_CATEGORY_ID = 'uncategorized'
      const getCategoryId = (skillName: string): string => skillsMap[skillName] ?? DEFAULT_CATEGORY_ID
      expect(getCategoryId('unknown-skill')).toBe('uncategorized')
    })
  })

  describe('groupSkillsByCategory logic', () => {
    it('should group skills correctly', () => {
      interface TestSkill {
        name: string
        category?: string
      }

      const skills: TestSkill[] = [
        { name: 'skill-a', category: 'development' },
        { name: 'skill-b', category: 'development' },
        { name: 'skill-c', category: 'creation' },
      ]

      const grouped = new Map<string, TestSkill[]>()

      for (const skill of skills) {
        const categoryId = skill.category ?? 'uncategorized'
        const group = grouped.get(categoryId) ?? []
        group.push(skill)
        grouped.set(categoryId, group)
      }

      expect(grouped.get('development')).toHaveLength(2)
      expect(grouped.get('creation')).toHaveLength(1)
      expect(grouped.get('uncategorized')).toBeUndefined()
    })

    it('should handle skills without category', () => {
      interface TestSkill {
        name: string
        category?: string
      }

      const skills: TestSkill[] = [{ name: 'skill-a', category: 'development' }, { name: 'skill-b' }]

      const grouped = new Map<string, TestSkill[]>()

      for (const skill of skills) {
        const categoryId = skill.category ?? 'uncategorized'
        const group = grouped.get(categoryId) ?? []
        group.push(skill)
        grouped.set(categoryId, group)
      }

      expect(grouped.get('development')).toHaveLength(1)
      expect(grouped.get('uncategorized')).toHaveLength(1)
    })
  })

  describe('category name formatting', () => {
    it('should format kebab-case to Title Case', () => {
      const formatCategoryName = (id: string): string => {
        return id
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      }

      expect(formatCategoryName('skill-creation')).toBe('Skill Creation')
      expect(formatCategoryName('development')).toBe('Development')
      expect(formatCategoryName('my-awesome-category')).toBe('My Awesome Category')
    })
  })

  describe('addCategory logic', () => {
    it('should not add duplicate categories', () => {
      const categories: CategoryInfo[] = [{ id: 'existing', name: 'Existing' }]

      const addCategory = (category: CategoryInfo): boolean => {
        if (categories.some((c) => c.id === category.id)) return false
        categories.push(category)
        return true
      }

      const result1 = addCategory({ id: 'new', name: 'New' })
      const result2 = addCategory({ id: 'existing', name: 'Existing' })
      expect(result1).toBe(true)
      expect(result2).toBe(false)
      expect(categories).toHaveLength(2)
    })
  })

  describe('assignSkillToCategory logic', () => {
    it('should create new category when assigning to non-existent', () => {
      const config: CategoriesConfig = { categories: [], skills: {} }

      const assignSkill = (skillName: string, categoryId: string, categoryName?: string): void => {
        if (!config.categories.some((c) => c.id === categoryId)) {
          config.categories.push({
            id: categoryId,
            name:
              categoryName ??
              categoryId
                .split('-')
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' '),
            priority: config.categories.length + 1,
          })
        }
        config.skills[skillName] = categoryId
      }

      assignSkill('new-skill', 'new-category', 'New Category')
      expect(config.categories).toHaveLength(1)
      expect(config.categories[0].id).toBe('new-category')
      expect(config.skills['new-skill']).toBe('new-category')
    })
  })
})
