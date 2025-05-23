// name: Generate text - stream

import 'dotenv/config'

import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

// import { anthropic } from "@ai-sdk/anthropic";
// const model = anthropic("claude-3-5-haiku-latest");

const model = openai('o3-mini')

export const answerMyQuestion = async (prompt: string) => {
  const { textStream } = streamText({
    model,
    prompt,
  })

  // The textStream is an AsyncIterable, so it can be
  // iterated over like an array.
  for await (const text of textStream) {
    process.stdout.write(text)
  }

  return textStream
}

const answer = await answerMyQuestion(
  'whats the color of the sun? how do we know that?'
)

console.log(answer)
