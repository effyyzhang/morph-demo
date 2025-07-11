import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    console.log("Chat API called, messages:", messages);
    console.log("API Key present:", !!process.env.OPENAI_API_KEY);

    const result = streamText({
      model: openai("gpt-3.5-turbo"),
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
