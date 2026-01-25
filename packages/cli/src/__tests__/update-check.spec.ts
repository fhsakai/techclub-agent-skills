import { jest } from '@jest/globals'

jest.unstable_mockModule('package-json', () => ({
  default: jest.fn(),
}))

const packageJsonModule = await import('package-json')
const packageJsonMock = packageJsonModule.default as unknown as jest.Mock<() => Promise<{ version: string }>>

const { checkForUpdates, getCurrentVersion } = await import('../update-check')

describe('update-check', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('checkForUpdates', () => {
    it('should return latest version when update is available', async () => {
      packageJsonMock.mockResolvedValue({ version: '2.0.0' })
      const result = await checkForUpdates('1.0.0')
      expect(result).toBe('2.0.0')
      expect(packageJsonMock).toHaveBeenCalledWith('@tech-leads-club/agent-skills')
    })

    it('should return null when already on latest version', async () => {
      packageJsonMock.mockResolvedValue({ version: '1.0.0' })
      const result = await checkForUpdates('1.0.0')
      expect(result).toBeNull()
    })

    it('should return null when registry is unavailable', async () => {
      packageJsonMock.mockRejectedValue(new Error('Network error'))
      const result = await checkForUpdates('1.0.0')
      expect(result).toBeNull()
    })
  })

  describe('getCurrentVersion', () => {
    it('should return a version string', () => {
      const version = getCurrentVersion()
      expect(typeof version).toBe('string')
      expect(version.length).toBeGreaterThan(0)
    })
  })
})
