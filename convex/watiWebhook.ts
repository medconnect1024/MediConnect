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
  created?: string;
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
  avatarUrl?: string | null;
  assignedId: string;
  operatorName: string;
  operatorEmail: string;
  waId: string;
  messageContact?: any;
  senderName?: string;
  listReply?: any;
  replyContextId?: any;
}

async function sendMessage(phoneNumber: string, message: string) {
  console.log(`Attempting to send message to ${phoneNumber}: ${message}`);
  const url = `${WATI_API_URL}/api/v1/sendSessionMessage/${phoneNumber}?messageText=${encodeURIComponent(message)}`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `${WATI_API_TOKEN}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to send message: ${response.status}, ${errorText}`);
      throw new Error(`Failed to send message: ${response.status}, ${errorText}`);
    }

    console.log(`Message sent successfully to ${phoneNumber}`);
    return await response.json();
  } catch (error) {
    console.error(`Error in sendMessage: ${error}`);
    throw error;
  }
}

async function sendInteractiveButtonMessage(phoneNumber: string, body: string, buttons: Array<{ text: string }>) {
  console.log(`Attempting to send interactive message to ${phoneNumber}: ${body}`);
  
  const url = `${WATI_API_URL}/api/v1/sendInteractiveButtonsMessage?whatsappNumber=${phoneNumber}`;
  const payload = {
    header: {
      type: "Text",
      text: "sdsds"  // This can be customized as needed
    },
    body: body,
    footer: "sds",  // Optional footer text, can be customized
    buttons: buttons.map(button => ({
      text: button.text  // Assuming you need to use `text` instead of `title`
    }))
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": WATI_API_TOKEN,  // Ensure the token is correctly prefixed with "Bearer "
        "Content-Type": "application/json-patch+json",
        "Accept": "*/*"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to send interactive message: ${response.status}, ${errorText}`);
      throw new Error(`Failed to send interactive message: ${response.status}, ${errorText}`);
    }

    console.log(`Interactive message sent successfully to ${phoneNumber}`);
    return await response.json();
  } catch (error) {
    console.error(`Error in sendInteractiveButtonMessage: ${error}`);
    throw error;
  }
}

async function getConversationContext(ctx: any, conversationId: string): Promise<string> {
  try {
    console.log(`Fetching conversation context for conversationId: ${conversationId}`);
    const messages = await ctx.runQuery(internal.messages.getConversationMessages, { conversationId, limit: 5 });
    const context = messages.map((m: { direction: string; content: any; }) => `${m.direction === 'inbound' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');
    console.log(`Conversation context retrieved: ${context}`);
    return context;
  } catch (error) {
    console.error(`Error getting conversation context: ${error}`);
    return "";
  }
}

async function isAppointmentRequest(response: string): Promise<boolean> {
  try {
    const prompt = `Does this message indicate that the user wants to book an appointment? Respond with "Yes" or "No". Message: "${response}"`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Choose model
      messages: [{ role: "user", content: prompt }],
      max_tokens: 5,
    });

    const answer = completion.choices[0]?.message?.content?.trim().toLowerCase();
    return answer === "yes";
  } catch (error) {
    console.error("Error detecting appointment request:", error);
    return false;
  }
}


async function processChatGPT(context: string, message: string): Promise<string> {
  try {
    console.log(`Processing message with ChatGPT: ${message}`);
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are Dr. Jagadeesh's personal assistant. Help patients with appointment scheduling and general inquiries. Provide concise and accurate information." },
        { role: "user", content: `Context:\n${context}\n\nUser's latest message: ${message}` }
      ],
      model: "gpt-3.5-turbo",
    });

    const response = completion.choices[0].message.content || "I'm sorry, I couldn't process that message.";
    console.log(`ChatGPT response: ${response}`);
    return response;
  } catch (error) {
    console.error(`Error in processChatGPT: ${error}`);
    return "I'm sorry, I encountered an error while processing your message. Please try again later.";
  }
}

export const handleWatiWebhook = httpAction(async (ctx, request) => {
  try {
    const payload = await request.json() as WatiWebhookPayload;
    console.log("Incoming webhook payload:", JSON.stringify(payload));

    // Check if it's a bot message (session message sent)
    if (payload.eventType === "sessionMessageSent" && payload.owner === true) {
      console.log("Bot message received, ignoring");
      return new Response(JSON.stringify({ status: "success", message: "Bot message received, ignoring" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Process only text messages from users
    if (payload.eventType !== "message" || (payload.type !== "interactive" && payload.type !== "text") ) {
      console.log("Non-text or non-user message received, ignoring");
      return new Response(JSON.stringify({ status: "success", message: "Non-text or non-user message received, ignoring" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const phoneNumber = payload.waId;
    const userMessage = payload.text;

    console.log(`Processing incoming message from ${phoneNumber}: ${userMessage}`);

    // Persist the incoming message
    await ctx.runMutation(internal.messages.createMessage, {
      phoneNumber,
      content: userMessage,
      direction: "inbound",
      timestamp: payload.timestamp,
      messageId: payload.id,
      conversationId: payload.conversationId
    });
    console.log("Incoming message persisted");

    // Get conversation context
    const context = await getConversationContext(ctx, payload.conversationId);
    let chatGPTResponse = ''
    // Process the message with ChatGPT
    // Check if we need to send an interactive message for appointment confirmation
    if (await isAppointmentRequest(userMessage)) {
      console.log("Sending interactive button message");
      await sendInteractiveButtonMessage(phoneNumber, "chatGPTResponse", [
  { text: "sds" },
  { text: "sds1" },
  { text: "sds2" }
]);
chatGPTResponse = 'interactive'
    } else {
       chatGPTResponse = await processChatGPT(context, userMessage);

      console.log("Sending regular message");
      // Send the response back to the user
      await sendMessage(phoneNumber, chatGPTResponse);
    }

    console.log("Response sent successfully");

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
    console.error("Error in handleWatiWebhook:", error);
    return new Response(JSON.stringify({ status: "error", message: "Error processing message" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});