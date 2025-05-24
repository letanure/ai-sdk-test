// name: Local model with LM studio

import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import { generateText } from 'ai'

import type { CoreTool } from 'ai'
import type { z } from 'zod'

/**
 * Matt here!
 *
 * I have a weird WSL setup which means I have occasional
 * trouble connecting to localhost. So, this is a me-only
 * workaround.
 */
const getLocalhost = () => {
  return process.env.LOCALHOST_OVERRIDE || 'localhost'
}

type GetZodObjectFromCoreTool<T> =
  T extends CoreTool<infer Z extends z.ZodType> ? z.infer<Z> : never

type GetToolExecutionMapFromTools<
  TTools extends Record<string, CoreTool<any>>,
> = {
  [K in keyof TTools]?: (
    args: GetZodObjectFromCoreTool<TTools[K]>
  ) => Promise<any>
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

const input = `Tell me a story about your grandmother.`

const localLLMResult = await askLocalLLMQuestion(input)

console.log(localLLMResult)
