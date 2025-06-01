// name: Describe Images

import { z } from 'zod'
import 'dotenv/config'
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

const model = openai('gpt-4o-mini-2024-07-18')

const systemPrompt =
  `You will receive an image. ` +
  `Please create an alt text for the image. ` +
  `Be concise. ` +
  `Use adjectives only when necessary. ` +
  `Do not pass 160 characters. ` +
  `Use simple language. `

export const describeImage = async (imageUrl: string) => {
  const { text } = await generateText({
    model,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            image: new URL(imageUrl),
          },
        ],
      },
    ],
  })

  return text
}

const description = await describeImage(
  'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
)

console.log(description)
