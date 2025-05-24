// generateTextSystemPromptRole
// name: Generate text - system prompt role

import { readFileSync } from 'fs'
import path from 'path'

import 'dotenv/config'

import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'

// import { anthropic } from "@ai-sdk/anthropic";
// const model = anthropic("claude-3-5-haiku-latest");

const model = openai('o3-mini')

export const summarizeText = async (input: string) => {
  const { text } = await generateText({
    model,
    prompt: input,
    system:
      `You are a text summarizer. ` +
      `Summarize the text you receive. ` +
      `Be concise. ` +
      `Return only the summary. ` +
      `Do not use the phrase "here is a summary". ` +
      `Highlight relevant phrases in bold. ` +
      `The summary should use the language of a 5 years old can understand. ` +
      `The summary should be two sentences long. `,
  })

  return text
}

const text = readFileSync(
  path.join(import.meta.dirname, 'text-example.md'),
  'utf-8'
)

const summary = await summarizeText(text)

console.log(summary)
