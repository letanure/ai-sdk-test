// name: Local model with LM Studio

import 'dotenv/config'
import readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import { generateText } from 'ai'

const getLocalhost = () => {
  return process.env.LOCALHOST_OVERRIDE || 'localhost'
}

const lmstudio = createOpenAICompatible({
  name: 'lmstudio',
  baseURL: `http://${getLocalhost()}:1234/v1`,
})

const model = lmstudio('')

export const askLocalLLMQuestion = async (input: string) => {
  const { text } = await generateText({
    model,
    prompt: input,
    maxRetries: 0,
  })

  return text
}

// Prompt user for input
const rl = readline.createInterface({ input, output })

const userInput = await rl.question('🧠 Ask your local LLM: ')
rl.close()

const localLLMResult = await askLocalLLMQuestion(userInput)

console.log('\n🤖', localLLMResult)
