import { fileURLToPath } from 'node:url'

import { dirname } from 'node:path'

const filename = fileURLToPath(import.meta.url)

export const __dirname = dirname(filename)
