import { NextRequest, NextResponse } from "next/server";
import { chatWithAI } from "@/lib/ai";
import { getFallbackChatResponse } from "@/lib/fallback-chat";
import { z } from "zod";

const ChatRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    })
  ),
  context: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parseResult = ChatRequestSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid chat request" },
        { status: 400 }
      );
    }

    const { messages, context } = parseResult.data;
    const lastUserMessage = messages[messages.length - 1]?.content || "";

    let response;
    try {
      response = await chatWithAI(messages, context);
    } catch (aiError) {
      console.warn("AI chat failed, falling back to local chat engine:", aiError);
      response = getFallbackChatResponse(lastUserMessage, context);
    }

    return NextResponse.json({ message: response });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to get response. Please try again." },
      { status: 500 }
    );
  }
}

