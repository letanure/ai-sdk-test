// name: Structured Data from PDFs

import 'dotenv/config'
import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { readFileSync } from 'fs'
import { z } from 'zod'
import path from 'path'

const model = openai('gpt-4o-mini-2024-07-18')

const schema = z
  .object({
    total: z.number().describe('The total amount of the invoice.'),
    currency: z.string().describe('The currency of the total amount.'),
    invoiceNumber: z.string().describe('The invoice number.'),
    companyAddress: z
      .string()
      .describe('The address of the company or person issuing the invoice.'),
    companyName: z
      .string()
      .describe('The name of the company issuing the invoice.'),
    invoiceeAddress: z
      .string()
      .describe('The address of the company or person receiving the invoice.'),
  })
  .describe('The extracted data from the invoice.')

export const extractDataFromInvoice = async (invoicePath: string) => {
  const { object } = await generateObject({
    model,
    system:
      `You will receive an invoice. ` +
      `Please extract the data from the invoice.`,
    schema,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'file',
            data: readFileSync(invoicePath),
            mimeType: 'application/pdf',
          },
        ],
      },
    ],
  })

  return object
}

const result = await extractDataFromInvoice(
  path.join(import.meta.dirname, './files/invoice-2.pdf')
)

console.dir(result, { depth: null })
