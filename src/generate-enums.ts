// name: Generate enums

import 'dotenv/config'
import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

const model = openai('gpt-4o-mini-2024-07-18')

export const classifySentiment = async (text: string) => {
  const { object } = await generateObject({
    model,
    output: 'enum',
    enum: ['positive', 'negative', 'neutral'],
    prompt: text,
    system:
      `Classify the sentiment of the text as either ` +
      `positive, negative, or neutral.`,
  })

  return object
}

// Ask for user input
const rl = readline.createInterface({ input, output })
const userPrompt = await rl.question(
  'Please enter a sentence to classify its sentiment: '
)
rl.close()

const result = await classifySentiment(userPrompt)

console.log(result)
