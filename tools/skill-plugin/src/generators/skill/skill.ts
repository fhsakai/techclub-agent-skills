import { formatFiles, generateFiles, names, Tree } from '@nx/devkit'
import * as path from 'path'

import { SKILLS_ROOT_DIR } from '@tech-leads-club/core'

import { assignSkillToCategory, categoryExists } from './category-utils'
import { SkillGeneratorSchema } from './schema'

export async function skillGenerator(tree: Tree, options: SkillGeneratorSchema) {
  const normalizedNames = names(options.name)
  const skillRoot = `${SKILLS_ROOT_DIR}/${normalizedNames.fileName}`

  generateFiles(tree, path.join(__dirname, 'files'), skillRoot, {
    ...normalizedNames,
    description: options.description || 'TODO: Add description',
    tmpl: '',
  })

  if (options.category) {
    const isExisting = categoryExists(tree, options.category)
    assignSkillToCategory(tree, normalizedNames.fileName, options.category)
    if (isExisting) console.log(`📁 Assigned to existing category: "${options.category}"`)
  } else {
    console.log(`ℹ️  No category specified. Skill will appear as "Uncategorized".`)
    console.log(`   To add a category, edit skills/categories.json`)
  }

  await formatFiles(tree)

  console.log(`
✅ Skill created!

📁 ${skillRoot}/SKILL.md
🔧 Test: npx @tech-leads-club/agent-skills --skill ${normalizedNames.fileName}
💡 Edit SKILL.md and customize the instructions
`)
}

export default skillGenerator
