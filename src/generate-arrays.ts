// name: Generate Arrays

import { z } from 'zod'
import 'dotenv/config'
import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

const model = openai('gpt-4o-mini-2024-07-18')

const schema = z.object({
  name: z.string().describe('The name of the user'),
  age: z.number().describe("The user's age"),
  email: z.string().email().describe("The user's email address, @example.com"),
})

export const createFakeUsers = async (input: string) => {
  const { object } = await generateObject({
    model: model,
    prompt: input,
    system: `You are generating fake user data.`,
    output: 'array',
    schema,
  })

  return object
}
// Ask for user input
const rl = readline.createInterface({ input, output })
const userPrompt = await rl.question(
  'Generate 5 fake users from wich country? (e.g. USA, UK, Canada): '
)
rl.close()

const result = await createFakeUsers(userPrompt)

console.log(result)
