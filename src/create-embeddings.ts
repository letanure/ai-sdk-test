// name: Create embeddings with LM Studio

import 'dotenv/config'

import { openai } from '@ai-sdk/openai'
import { embedMany, embed, cosineSimilarity } from 'ai'
import readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

const model = openai.embedding('text-embedding-3-small')

const values = ['Dog', 'Cat', 'Car', 'Bike']

const { embeddings } = await embedMany({
  model: model,
  values,
})

const vectorDatabase = embeddings.map((embedding, index) => ({
  value: values[index]!,
  embedding,
}))

// Ask for user input
const rl = readline.createInterface({ input, output })
const userPrompt = await rl.question(
  'Please enter a term to search in the vector database: '
)
rl.close()

const searchTerm = await embed({
  model: model,
  value: userPrompt,
})

const entries = vectorDatabase.map((entry) => {
  return {
    value: entry.value,
    similarity: cosineSimilarity(entry.embedding, searchTerm.embedding),
  }
})

const sortedEntries = entries.sort((a, b) => b.similarity - a.similarity)

console.dir(sortedEntries, { depth: null })
