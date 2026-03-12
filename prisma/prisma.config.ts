import path from 'node:path'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: path.join(__dirname, 'schema.prisma'),
  datasource: {
    url: process.env.DATABASE_URL ?? 'postgresql://vibecoder:vibecoder@localhost:5432/app',
  },
})
