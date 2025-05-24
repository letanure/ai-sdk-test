// name: Chat history

import 'dotenv/config'
import { openai } from '@ai-sdk/openai'
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { once } from 'node:events'
import { generateText, type CoreMessage } from 'ai'
import { intro, outro, text, isCancel } from '@clack/prompts'

const model = openai('gpt-4o-mini-2024-07-18')

const startServer = async () => {
  const app = new Hono()

  app.post('/api/get-completions', async (ctx) => {
    const messages: CoreMessage[] = await ctx.req.json()

    const result = await generateText({
      model,
      messages,
    })

    return ctx.json(result.response.messages)
  })

  const server = serve({
    fetch: app.fetch,
    port: 4317,
    hostname: '0.0.0.0',
  })

  await once(server, 'listening')

  return server
}

const server = await startServer()

intro('Chat with GPT-4o')

const messagesToSend: CoreMessage[] = []

while (true) {
  const input = await text({
    message: 'You:',
    placeholder: 'Type a message (or leave blank to exit)',
  })

  if (!input || isCancel(input)) break

  messagesToSend.push({
    role: 'user',
    content: input,
  })

  const response = await fetch('http://localhost:4317/api/get-completions', {
    method: 'POST',
    body: JSON.stringify(messagesToSend),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const newMessages = (await response.json()) as CoreMessage[]
  messagesToSend.push(...newMessages)

  const last = newMessages.at(-1)

  if (last?.role === 'assistant' && Array.isArray(last.content)) {
    const reply = last.content
      .filter((c) => c.type === 'text')
      .map((c) => c.text)
      .join('\n')
    console.log(`\nAI: ${reply}\n`)
  } else {
    console.log('\nAI: [No valid response]\n')
  }
}

server.close()
outro('Goodbye!')
