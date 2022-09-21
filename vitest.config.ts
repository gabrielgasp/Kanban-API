import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      excludeNodeModules: true,
      exclude: [
        'src/server.ts',
        'src/database/connection.ts',
        'src/ts',
      ],
      reportsDirectory: 'coverage',
    }
  }
})
