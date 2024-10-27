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

const OFFICE_HOURS = {
  open: 10,
  close: 17
};

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

async function sendInteractiveButtonMessage(phoneNumber: string, body: string) {
  console.log(`Attempting to send interactive message to ${phoneNumber}: ${body}`);
  
  const url = `${WATI_API_URL}/api/v1/sendInteractiveButtonsMessage?whatsappNumber=${phoneNumber}`;
  const payload = JSON.parse(body)

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": WATI_API_TOKEN,
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
    const prompt = `Does this message indicate that the user wants to book, reschedule, or cancel an appointment? Respond with "Yes" or "No". Message: "${response}"`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
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

function isWithinOfficeHours(time: string): boolean {
  const [hours, minutes] = time.split(':').map(Number);
  return hours >= OFFICE_HOURS.open && hours < OFFICE_HOURS.close;
}

function getNextAvailableSlot(date: string, time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  let nextHour = hours + 1;
  if (nextHour >= OFFICE_HOURS.close) {
    return `The next available slot is tomorrow at ${OFFICE_HOURS.open}:00 AM.`;
  }
  return `The next available slot is today at ${nextHour}:00.`;
}

function extractAppointmentDetails(message: string): { date?: string; time?: string } {
  const dateMatch = message.match(/\d{4}-\d{2}-\d{2}/);
  const timeMatch = message.match(/\d{1,2}:\d{2}/);
  return {
    date: dateMatch ? dateMatch[0] : undefined,
    time: timeMatch ? timeMatch[0] : undefined
  };
}

async function processChatGPT(context: string, message: string): Promise<string> {
  try {
    console.log(`Processing message with ChatGPT: ${message}`);
    const systemPrompt = `
    
Hello! I’m your dedicated assistant at Dr. Jagadeesh's Liver Surgery Office, here to make booking and preparing for your appointment as seamless as possible. I’ll guide you through the scheduling process and gather any necessary details.

Welcome to Dr. Jagadeesh's Liver Surgery Office!
Let’s start with your preferred date and time for the appointment.

What date would you like to schedule your consultation?
(Please enter a specific date or indicate if you’d like the earliest available.)

When would you prefer to come in on this date?

1. Morning (8 AM - 12 PM)
2. Afternoon (12 PM - 4 PM)
3. Evening (4 PM - 8 PM)
What type of consultation are you scheduling today?

1. New patient
2. Follow-up
3. Routine check-up
What’s the primary reason for your visit?

1. Acute liver issue
2. Chronic liver issue
Are you experiencing any specific symptoms?

1. Abdominal pain
2. Jaundice
3. Fatigue
How long have you had these symptoms?

1. Less than 1 week
2. 1–3 weeks
3. Over 3 weeks
Do you have any existing liver conditions?

1. No liver condition
2. Chronic liver condition
3. Recent liver condition
Final Confirmation
Thank you for providing your information. Here’s a summary of your appointment preferences:

Appointment Date: [Chosen Date]
Preferred Time: [Chosen Time]
Consultation Type: [Chosen Type]
Reason for Visit: [Primary Reason]
Symptoms: [Selected Symptoms]
Symptom Duration: [Duration]
Existing Conditions: [Conditions]
Please confirm that these details are correct by replying "Yes" to proceed or "No" to make any changes. We're here to make sure everything is arranged to your satisfaction!

    `;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Context:\n${context}\n\nUser's latest message: ${message}` }
      ],
      model: "gpt-3.5-turbo",
    });

    let response = completion.choices[0].message.content || "I'm sorry, I couldn't process that message.";
    
    // Check if it's an appointment request and handle accordingly
    if (await isAppointmentRequest(message)) {
      const appointmentDetails = extractAppointmentDetails(message);
      if (appointmentDetails.time && !isWithinOfficeHours(appointmentDetails.time)) {
        response += ` I'm sorry, but the requested time is outside our office hours. ${getNextAvailableSlot(appointmentDetails.date || '', appointmentDetails.time)}`;
      }
    }

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
    
    // Process the message with ChatGPT
    let chatGPTResponse = await processChatGPT(context, userMessage);

    // Check if we need to send an interactive message for appointment confirmation
    // if (await isAppointmentRequest(userMessage)) {
    //   console.log("Sending interactive button message for appointment confirmation");
    //   await sendInteractiveButtonMessage(phoneNumber, chatGPTResponse, [
    //     { text: "Confirm Appointment" },
    //     { text: "Reschedule" },
    //     { text: "Cancel" }
    //   ]);
    //   chatGPTResponse = 'Interactive message sent for appointment confirmation';
    // } else {
    //   console.log("Sending regular message");
    //   // Send the response back to the user
    //   await sendMessage(phoneNumber, chatGPTResponse);
    // }
   // await sendInteractiveButtonMessage(phoneNumber, chatGPTResponse)
   await sendMessage(phoneNumber, chatGPTResponse)
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