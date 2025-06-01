// name: Agent weather tool

import 'dotenv/config'

import { openai } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'
import { streamText, tool } from 'ai'
import { z } from 'zod'
import { generateText } from 'ai'
import readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

const model = anthropic('claude-3-5-haiku-latest')

const getWeatherTool = tool({
  description: 'Get the current weather in the specified city',
  parameters: z.object({
    city: z.string().describe('The city to get the weather for'),
  }),
  execute: async ({ city }) => {
    return `The weather in ${city} is 25°C and sunny.`
  },
})

const askAQuestion = async (prompt: string) => {
  const { textStream } = await streamText({
    model,
    prompt,
    tools: {
      getWeather: getWeatherTool,
    },
    maxSteps: 2,
  })

  for await (const text of textStream) {
    process.stdout.write(text)
  }
}

// Ask for user input
const rl = readline.createInterface({ input, output })
const userPrompt = await rl.question(
  'Wich city do you want to know the weather for? '
)
rl.close()

await askAQuestion(`What's the weather in ${userPrompt}?`)
