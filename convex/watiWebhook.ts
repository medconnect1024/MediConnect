import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import OpenAI from 'openai';

const WATI_API_URL = process.env.WATI_API_URL!;
const WATI_API_TOKEN = process.env.WATI_API_TOKEN!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

if (!WATI_API_URL || !WATI_API_TOKEN || !OPENAI_API_KEY) {
  throw new Error("Missing required environment variables");
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

interface WatiWebhookPayload {
  id: string;
  created: string;
  whatsappMessageId: string;
  conversationId: string;
  ticketId: string;
  text: string;
  type: string;
  data: any;
  timestamp: string;
  owner: boolean;
  eventType: string;
  statusString: string;
  avatarUrl: string | null;
  assignedId: string;
  operatorName: string;
  operatorEmail: string;
  waId: string;
  messageContact: any;
  senderName: string;
  listReply: any;
  replyContextId: any;
}

async function sendMessage(phoneNumber: string, message: string) {
  const url = `${WATI_API_URL}/api/v1/sendSessionMessage/${phoneNumber}?messageText=${encodeURIComponent(message)}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": WATI_API_TOKEN,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to send message: ${response.status}, ${await response.text()}`);
  }
}

async function getConversationContext(ctx: any, conversationId: string): Promise<string> {
  const messages = await ctx.runQuery(internal.messages.getConversationMessages, { conversationId });
  return messages.slice(-5).map((m: { direction: string; content: any; }) => `${m.direction === 'inbound' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');
}

async function processChatGPT(context: string, message: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful medical assistant. Provide concise and accurate information." },
      { role: "user", content: `Context:\n${context}\n\nUser's latest message: ${message}` }
    ],
    model: "gpt-3.5-turbo",
  });

  return completion.choices[0].message.content || "I'm sorry, I couldn't process that message.";
}

export const handleWatiWebhook = httpAction(async (ctx, request) => {
  const payload = await request.json() as WatiWebhookPayload;
  console.log("Incoming message:", payload);

  if (payload.type !== "text" || payload.owner) {
    return new Response(JSON.stringify({ status: "success", message: "Non-text message or bot message received" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const phoneNumber = payload.waId;

  try {
    // Persist the incoming message
    await ctx.runMutation(internal.messages.createMessage, {
      phoneNumber,
      content: payload.text,
      direction: "inbound",
      timestamp: payload.timestamp,
      messageId: payload.id,
      conversationId: payload.conversationId
    });

    // Get conversation context
    const context = await getConversationContext(ctx, payload.conversationId);

    // Process the message with ChatGPT
    const chatGPTResponse = await processChatGPT(context, payload.text);

    // Send the response back to the user
    await sendMessage(phoneNumber, chatGPTResponse);

    // Persist the outgoing message
    await ctx.runMutation(internal.messages.createMessage, {
      phoneNumber,
      content: chatGPTResponse,
      direction: "outbound",
      timestamp: Date.now().toString(),
      messageId: `response_${payload.id}`,
      conversationId: payload.conversationId
    });

    return new Response(JSON.stringify({ status: "success", message: "Message processed and replied" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing message:", error);
    await sendMessage(phoneNumber, "An error occurred while processing your message. Please try again later.");
    return new Response(JSON.stringify({ status: "error", message: "Error processing message" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});