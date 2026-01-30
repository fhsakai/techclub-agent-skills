import { Tree } from '@nx/devkit'
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'

import { SkillGeneratorSchema } from './schema'
import { skillGenerator } from './skill'

describe('skill generator', () => {
  let tree: Tree
  const options: SkillGeneratorSchema = { name: 'test' }

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
  })

  it('should create skill at root when no category specified', async () => {
    await skillGenerator(tree, options)
    expect(tree.exists('skills/test/SKILL.md')).toBeTruthy()
  })

  it('should create skill inside category folder when category specified', async () => {
    await skillGenerator(tree, { name: 'my-skill', category: 'development' })
    expect(tree.exists('skills/(development)/my-skill/SKILL.md')).toBeTruthy()
  })

  it('should create category folder if it does not exist', async () => {
    await skillGenerator(tree, { name: 'my-skill', category: 'new-category' })
    expect(tree.exists('skills/(new-category)/my-skill/SKILL.md')).toBeTruthy()
  })

  it('should add skill to existing category folder', async () => {
    tree.write('skills/(existing-category)/.gitkeep', '')
    await skillGenerator(tree, { name: 'skill-a', category: 'existing-category' })
    await skillGenerator(tree, { name: 'skill-b', category: 'existing-category' })
    expect(tree.exists('skills/(existing-category)/skill-a/SKILL.md')).toBeTruthy()
    expect(tree.exists('skills/(existing-category)/skill-b/SKILL.md')).toBeTruthy()
  })

  it('should handle kebab-case skill names', async () => {
    await skillGenerator(tree, { name: 'my-awesome-skill', category: 'tools' })
    expect(tree.exists('skills/(tools)/my-awesome-skill/SKILL.md')).toBeTruthy()
  })

  it('should include description in SKILL.md frontmatter', async () => {
    await skillGenerator(tree, { name: 'documented-skill', description: 'A well documented skill' })
    const content = tree.read('skills/documented-skill/SKILL.md', 'utf-8')
    expect(content).toContain('description: A well documented skill')
  })

  it('should use placeholder description when not provided', async () => {
    await skillGenerator(tree, { name: 'basic-skill' })
    const content = tree.read('skills/basic-skill/SKILL.md', 'utf-8')
    expect(content).toContain('description: TODO: Add description')
  })

  it('should throw error if skill already exists', async () => {
    tree.write('skills/test/SKILL.md', '')
    await expect(skillGenerator(tree, options)).rejects.toThrow(
      'A skill with the name "test" already exists in "skills/test".',
    )
  })

  it('should throw error if skill already exists in a category', async () => {
    tree.write('skills/(dev)/test/SKILL.md', '')
    await expect(skillGenerator(tree, { name: 'test', category: 'dev' })).rejects.toThrow(
      'A skill with the name "test" already exists in "skills/(dev)/test".',
    )
  })
})
