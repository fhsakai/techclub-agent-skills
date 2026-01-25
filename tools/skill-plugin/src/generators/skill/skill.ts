import { formatFiles, generateFiles, names, Tree } from '@nx/devkit'
import * as path from 'path'
import { fileURLToPath } from 'url'

import { SkillGeneratorSchema } from './schema'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export async function skillGenerator(tree: Tree, options: SkillGeneratorSchema) {
  const normalizedNames = names(options.name)
  const skillRoot = `skills/${normalizedNames.fileName}`

  generateFiles(tree, path.join(__dirname, 'files'), skillRoot, {
    ...normalizedNames,
    description: options.description || 'TODO: Add description',
    tmpl: '',
  })

  await formatFiles(tree)

  console.log(`
✅ Skill created!

📁 ${skillRoot}/SKILL.md
🔧 Test: npx @tech-leads-club/agent-skills --skill ${normalizedNames.fileName}
💡 Edit SKILL.md and customize the instructions
`)
}

export default skillGenerator
