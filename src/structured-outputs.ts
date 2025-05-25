// name: Structured outputs

import 'dotenv/config'
import { generateObject } from 'ai'
import { z } from 'zod'
import { openai } from '@ai-sdk/openai'
import readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

const model = openai('gpt-4o-mini-2024-07-18')

const schema = z.object({
  recipe: z.object({
    name: z.string().describe('The title of the recipe'),
    ingredients: z
      .array(
        z.object({
          name: z.string(),
          amount: z.string(),
        })
      )
      .describe('The ingredients needed for the recipe'),
    steps: z.array(z.string()).describe('The steps to make the recipe'),
  }),
})

export const createRecipe = async (prompt: string) => {
  const { object } = await generateObject({
    model,
    schema,
    prompt,
    schemaName: 'Recipe',
    system:
      `You are helping a user create a recipe. ` +
      `Use British English variants of ingredient names,` +
      `like Coriander over Cilantro.`,
  })

  return object.recipe
}

// Ask for user input
const rl = readline.createInterface({ input, output })
const userPrompt = await rl.question(
  '👩‍🍳 What recipe would you like to generate? '
)
rl.close()

const recipe = await createRecipe(userPrompt)

console.dir(recipe, { depth: null })
