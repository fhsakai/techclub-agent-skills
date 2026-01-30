import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals'
import type { Mock } from 'jest-mock'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import type { AgentConfig, AgentType, InstallOptions, SkillInfo } from '../types'

jest.unstable_mockModule('../project-root', () => ({
  findProjectRoot: jest.fn(),
}))

const mockAgents: Record<string, AgentConfig> = {}

jest.unstable_mockModule('../agents', () => ({
  agents: mockAgents,
  getAgentConfig: (agent: AgentType) => mockAgents[agent],
  detectInstalledAgents: jest.fn(),
  getAllAgentTypes: jest.fn(),
}))

const { installSkills, listInstalledSkills } = await import('../installer')
const { findProjectRoot: mockFindProjectRoot } = (await import('../project-root')) as {
  findProjectRoot: Mock<() => string>
}

describe('installer', () => {
  let tempDir: string
  let skillsSourceDir: string
  let projectRootDir: string

  beforeEach(async () => {
    tempDir = join(tmpdir(), `installer-test-${Date.now()}`)
    skillsSourceDir = join(tempDir, 'source-skills')
    projectRootDir = join(tempDir, 'mock-project')

    await mkdir(skillsSourceDir, { recursive: true })
    await mkdir(projectRootDir, { recursive: true })

    mockFindProjectRoot.mockReturnValue(projectRootDir)

    const home = join(tempDir, 'home')
    mockAgents.cursor = {
      name: 'cursor',
      displayName: 'Cursor',
      description: 'Cursor IDE',
      skillsDir: '.cursor/skills',
      globalSkillsDir: join(home, '.cursor/skills'),
      detectInstalled: () => true,
    }
    mockAgents['claude-code'] = {
      name: 'claude-code',
      displayName: 'Claude Code',
      description: 'Claude Code',
      skillsDir: '.claude/skills',
      globalSkillsDir: join(home, '.claude/skills'),
      detectInstalled: () => true,
    }
  })

  afterEach(async () => {
    try {
      await rm(tempDir, { recursive: true, force: true })
    } catch {
      // Ignore cleanup errors
    }
    jest.clearAllMocks()

    for (const key in mockAgents) {
      delete mockAgents[key]
    }
  })

  describe('installSkills', () => {
    it('should install a skill into the project directory', async () => {
      const mockSkill: SkillInfo = {
        name: 'test-skill',
        description: 'A test skill',
        path: skillsSourceDir,
      }

      await writeFile(join(skillsSourceDir, 'SKILL.md'), '# Test Skill')

      const mockOptions: InstallOptions = {
        global: false,
        method: 'copy',
        agents: ['cursor'],
        skills: ['test-skill'],
      }

      const results = await installSkills([mockSkill], mockOptions)

      expect(results[0].success).toBe(true)
      expect(results[0].path).toContain(join(projectRootDir, '.cursor/skills'))
    })

    it('should handle empty skills array', async () => {
      const mockOptions: InstallOptions = {
        global: false,
        method: 'symlink',
        agents: ['cursor'],
        skills: [],
      }

      const results = await installSkills([], mockOptions)
      expect(results).toEqual([])
    })

    it('should handle multiple agents', async () => {
      const mockSkill: SkillInfo = {
        name: 'test-skill',
        description: 'A test skill',
        path: skillsSourceDir,
      }

      await writeFile(join(skillsSourceDir, 'SKILL.md'), '# Test Skill')

      const mockOptions: InstallOptions = {
        global: false,
        method: 'copy',
        agents: ['cursor', 'claude-code'],
        skills: ['test-skill'],
      }

      const results = await installSkills([mockSkill], mockOptions)
      expect(results.length).toBe(2)
      expect(results.map((r) => r.agent)).toContain('Cursor')
      expect(results.map((r) => r.agent)).toContain('Claude Code')
    })
  })

  describe('listInstalledSkills', () => {
    it('should return empty array for non-existent directory', async () => {
      const skills = await listInstalledSkills('cursor', false)
      expect(Array.isArray(skills)).toBe(true)
    })
  })
})
