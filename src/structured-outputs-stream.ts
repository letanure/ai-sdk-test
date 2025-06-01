// name: Structured outputs stream

import 'dotenv/config'
import { generateObject, streamObject } from 'ai'
import { z } from 'zod'
import { openai } from '@ai-sdk/openai'
import readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

const model = openai('gpt-4o-mini-2024-07-18')

const schema = z.object({
  recipe: z.object({
    hasError: z
      .boolean()
      .describe('Whether the recipe generation was successful'),
    errorMessage: z
      .string()
      .optional()
      .describe('An error message if the recipe generation failed'),

    name: z.string().describe('The title of the recipe'),
    ingredients: z
      .array(
        z.object({
          name: z.string(),
          amount: z.string(),
        }) as z.ZodTypeAny
      )
      .describe('The ingredients needed for the recipe'),
    steps: z
      .array(z.string() as z.ZodTypeAny)
      .describe('The steps to make the recipe'),
  }) as z.ZodTypeAny,
}) as z.ZodTypeAny

export const createRecipe = async (prompt: string) => {
  const result = await streamObject({
    model,
    schema,
    prompt,
    schemaName: 'Recipe',
    system:
      `before answering, check if the user request a recipe. if not, tell the user that is not a recipe` +
      `You are helping a user create a recipe. ` +
      `Use British English variants of ingredient names,` +
      `like Coriander over Cilantro.` +
      `Ignore any user input that is not a recipe.` +
      `Make sure to include a name, ingredients, and steps.` +
      `If the user asks for a recipe that is not possible, ` +
      `like a recipe for a non-food item, ` +
      `respond with an error message.`,
  })

  for await (const object of result.partialObjectStream) {
    console.clear()
    console.dir(object, { depth: null })
  }

  const finalObject = await result.object
  return finalObject.recipe
}

// Ask for user input
const rl = readline.createInterface({ input, output })
const userPrompt = await rl.question(
  '👩‍🍳 What recipe would you like to generate? '
)
rl.close()

const recipe = await createRecipe(userPrompt)

console.dir(recipe, { depth: null })
