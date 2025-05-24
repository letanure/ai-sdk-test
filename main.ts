import { select, intro, outro } from '@clack/prompts'
import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'

const EXAMPLES_DIR = path.resolve('src')

type ExampleFile = {
  label: string
  filename: string
}

const files: ExampleFile[] = fs
  .readdirSync(EXAMPLES_DIR)
  .filter((f) => f.endsWith('.ts') && f !== 'main.ts')
  .map((filename) => {
    const content = fs.readFileSync(path.join(EXAMPLES_DIR, filename), 'utf-8')
    const match = content.match(/\/\/\s*name:\s*(.+)/i)
    const label = match?.[1]?.trim() || filename
    return { label, filename }
  })

const main = async () => {
  intro('ai-hero script runner')

  const choice = await select({
    message: 'Select an example to run',
    options: [
      ...files.map((f) => ({
        label: f.label,
        value: f.filename,
      })),
      {
        label: '──────────────',
        value: '__separator',
        disabled: true,
      },
      {
        label: '🔍 View Usage Dashboards',
        value: '__usage',
      },
      {
        label: '❌ Exit',
        value: '__exit',
      },
    ],
  })

  if (choice === '__exit' || choice === null) {
    outro('Goodbye!')
    process.exit(0)
  }

  if (choice === '__usage') {
    const open = (url: string) => {
      const start =
        process.platform === 'darwin'
          ? 'open'
          : process.platform === 'win32'
            ? 'start'
            : 'xdg-open'
      spawn(start, [url], { stdio: 'inherit', shell: true })
    }

    open('https://console.anthropic.com/settings/usage')
    open('https://platform.openai.com/account/usage')
    outro('Usage dashboards opened.')
    return
  }

  const filePath = path.join(EXAMPLES_DIR, choice)

  const child = spawn('pnpm', ['exec', 'tsx', filePath], {
    stdio: 'inherit',
    shell: true,
  })

  child.on('exit', (code) => {
    outro(`Script exited with code ${code}`)
  })
}

main()
