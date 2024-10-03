import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const SYSTEM_PROMPT = `You are a specialized AI assistant for planning road trips in the USA. 
Your task is to provide road trip routes between two locations in the United States. 
If a user asks for anything not related to USA road trips, politely refuse and remind them of your specific function. 
When providing road trip routes, include major cities or landmarks along the way, estimated driving times, and any notable attractions or stops.`

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages
      ],
      temperature: 0.7,
    })

    const message = completion.choices[0].message.content

    return NextResponse.json({ message })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
  }
}