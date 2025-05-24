import inquirer from 'inquirer'
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
  const { choice } = await inquirer.prompt([
    {
      name: 'choice',
      type: 'list',
      message: 'Select an example to run:',
      choices: [
        ...files.map((f) => ({
          name: f.label,
          value: f.filename,
        })),
        new inquirer.Separator(),
        { name: 'Exit', value: '__exit' },
      ],
    },
  ])

  if (choice === '__exit') {
    console.log('Goodbye!')
    process.exit(0)
  }

  const filePath = path.join(EXAMPLES_DIR, choice)

  const child = spawn('pnpm', ['exec', 'tsx', filePath], {
    stdio: 'inherit',
    shell: true,
  })

  child.on('exit', (code) => {
    console.log(`\nScript exited with code ${code}`)
  })
}

main()
