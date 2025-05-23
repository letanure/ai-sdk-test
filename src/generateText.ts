// name: Generate text - simple

import 'dotenv/config'

import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'

// import { anthropic } from "@ai-sdk/anthropic";
// const model = anthropic("claude-3-5-haiku-latest");

const model = openai('o3-mini')

export const answerMyQuestion = async (prompt: string) => {
  const { text } = await generateText({
    model,
    prompt,
  })

  return text
}

const answer = await answerMyQuestion(
  'what is the chemical formula for dihydrogen monoxide? draw a diagram of the molecule using text art'
)

console.log(answer)
