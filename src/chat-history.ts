// name: Chat history

import 'dotenv/config'
import { openai } from '@ai-sdk/openai'
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { once } from 'node:events'
import { generateText, type CoreMessage } from 'ai'

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

const messagesToSend: CoreMessage[] = [
  {
    role: 'user',
    content: "What's the capital of Wales?",
  },
]

const response = await fetch('http://localhost:4317/api/get-completions', {
  method: 'POST',
  body: JSON.stringify(messagesToSend),
  headers: {
    'Content-Type': 'application/json',
  },
})

const newMessages = (await response.json()) as CoreMessage[]

const allMessages = [...messagesToSend, ...newMessages]

console.dir(allMessages, { depth: null })

server.close()
