import { generateText } from "ai"

const systemPrompt = `You are the Zenpay Assistant, a helpful AI guide for the Zenpay money management app. 
You help users with:
- Budget tips and strategies
- Setting and tracking savings goals
- Smart spending habits
- Daily spending limits and financial planning
- UPI payments and money transfers
- Bill management
- Fraud protection and security tips

Keep responses concise (1-2 sentences max), friendly, and actionable. Focus on practical financial wellness advice.
If asked about topics unrelated to personal finance or Zenpay, politely redirect to financial topics.`

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()

    const result = streamText({
      model: "openai/gpt-4-turbo",
      system: systemPrompt,
      messages,
    })

    const stream = result.toDataStream()
    return new Response(stream)
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return new Response("Error processing your message", { status: 500 })
  }
}
