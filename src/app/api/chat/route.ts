
import { OpenAI } from "openai";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const prisma = new PrismaClient();

import { NextRequest, NextResponse } from 'next/server';

type Message = { role: string; content: string };
const sessions = new Map<string, Message[]>();
// Define the system's instruction/context
const systemPrompt = (context: { donation_prompts: any, what_we_do_prompts: any, FAQ: any }) => `
You are a customer support bot for a Capital Area Food Bank.
Answer common questions about food distribution, volunteer opportunities, and donations.
You are unable to solve issues with orders, only escalate them, or find out more information about the order.
Dont list out your answers, just give a response tailored to the customer's request, be conversational/friendly but concise.
If they are asking about an order, ask for the order number first, if they did not already provide it.
1. BEFORE ESCALATING AN ISSUE, Collect relevant details (name, contact, issue type, urgency, order number if applicable). 
  1a. If a customer is asking about a specific order that they are looking to change, ASK FOR THE ORDER NUMBER FIRST.
  1b. If you feel like you can solve the issue with only the information provided, solve the issue. 
  1c. If you feel like you can collect more information, ask the customer for more information.
  1d. If any of the previous steps are not possible, continue with the following steps. Otherwise, send your response to the customer asking for information..


2. Create a priority score based on the urgency of the issue out of 100.
Base the priority score on the following:
- Urgency of the issue
- Impact of the issue on the customer
- Complexity of the issue
- Time sensitivity of the issue
- Customer's urgency
4. Create an action date, which is the date and time, by which the ticket needs to be resolved.
5. If you have collected all the information needed, inform the customer that you have elevated their request to the appropriate department (If you have not solved the problem) and that they will receive a message with as soon as possible to help them.
6. At the VERY END of your message to the customer add the text:
COMPANY INFORMATION: Then the details surrounding the ticket and your score:
Customer Name: \n
Contact: \n
Issue Type: \n
Urgency: \n
Order Number: \n
Comments: \n
Priority Score: \n
Action Date:

DO NOT GIVE INFORMATION THAT YOU ARE NOT SURE ABOUT.
Alawys give a response tailored to the customer's request. If you cannot resolve the issue, do not say that you cannot help.


`;
//Additional context about the company: ${JSON.stringify(context)}
const donation_prompts =
{
  "foodDonations": {
    "description": "The Capital Area Food Bank works with food distributors, retailers, restaurants, farms, and individuals to collect food donations.",
    "details": "These donations are processed at our 123,000 square-foot distribution center where staff and volunteers sort and prepare food for distribution to nonprofit partners and community members.",
    "callToAction": "To donate food, please visit our donation page or contact us for more information."
  },
  "monetaryDonations": {
    "description": "Donating money is another way you can support the Capital Area Food Bank’s mission to fight hunger.",
    "details": "Monetary donations allow us to purchase and distribute nutritious food, fund community programs, and support our network of nonprofit partners.",
    "callToAction": "You can donate money online through our website or by sending a check to our distribution center.",
    "impact": "Every $1 you donate provides 2 meals, helping children, families, and seniors in need. Your generosity can help a child focus in school, enable a mom to make it through her night shift while paying her bills, and help a senior avoid life-threatening illnesses.",
    "donationOptions": {
      "oneTime": "One-time donation",
      "monthly": "Monthly donation"
    },
    "link": "https://give.capitalareafoodbank.org/give/324509/#!/donation/checkout"
  },
  "volunteerDonations": {
    "description": "We also welcome volunteer support for our food donation programs.",
    "details": "Volunteers help us sort, pack, and distribute food to the community. Each year, over 20,000 volunteers help us serve those in need.",
    "callToAction": "If you'd like to volunteer, please visit our volunteer opportunities page to learn more and sign up."
  },
  "donationEvents": {
    "description": "The Capital Area Food Bank regularly hosts food drives and donation events.",
    "details": "These events allow individuals, schools, and businesses to donate food directly to us. They are organized throughout the year in different locations.",
    "callToAction": "To learn more about upcoming donation events and how you can participate, check our events calendar on our website."
  },
  "partnershipOpportunities": {
    "description": "We also partner with organizations to source large-scale food donations.",
    "details": "Our partners include food distributors, grocery stores, restaurants, and local farms. These partnerships allow us to provide consistent and high-quality food to the community.",
    "callToAction": "If you're interested in becoming a donation partner, please reach out to us through our partnership inquiry page.",
    "link": "https://www.capitalareafoodbank.org/what-we-do/food-plus-partnerships/"
  }
}

const what_we_do_prompts =
{
  "mission": {
    "description": "Everyone deserves good food today and a bright future tomorrow.",
    "details": "The Capital Area Food Bank works with 400+ nonprofit partners across the region to provide more than 60 million meals every year."
  },
  "foodProvision": {
    "description": "Providing food to help people thrive today.",
    "details": "We are the anchor of the hunger relief infrastructure in the region, providing more than 60 million meals. But we don’t stop at meals. We address the root causes of hunger by partnering with organizations offering job training programs, healthcare, and other critical services."
  },
  "challenges": {
    "description": "Without good food, everything becomes more difficult.",
    "details": "Food is essential to thinking, learning, growing, and staying healthy. Every day, our partners, donors, and volunteers help to change that for thousands of people."
  },
  "programs": {
    "foodDonations": {
      "description": "We collaborate with food distributors, retailers, restaurants, farms, and individuals for food donations.",
      "details": "Our 123,000 square-foot distribution center sorts and prepares food for distribution to nonprofit partners and the community."
    },
    "volunteerOpportunities": {
      "description": "We rely on volunteers to sort, pack, and distribute food.",
      "details": "Over 20,000 volunteers help us every year to serve those in need."
    },
    "nonprofitPartners": {
      "description": "We work with over 400 nonprofit food assistance partners.",
      "details": "From large organizations like Martha’s Table to smaller community kitchens, we provide food to serve families, kids, and seniors."
    },
    "directDistributionPrograms": {
      "description": "We distribute food directly to the community when partners aren't available.",
      "details": "Our direct programs include after-school meals, free produce markets, and emergency food distributions."
    }
  },
  "communityImpact": {
    "description": "We’re helping neighbors in need every day.",
    "details": "Thousands of people in our community rely on us to put food on their tables. Partners, contributors, and volunteers make it possible to bring nourishment and hope."
  },
  "creatingBrightFutures": {
    "description": "Food can move people forward.",
    "details": "In addition to providing food for today, we work to help families transform their lives and leave hunger behind through our various programs."
  },
  "initiatives": {
    "foodPlusPartnerships": {
      "description": "We partner with regional organizations to strengthen programs that empower people.",
      "details": "Food is used as a tool to help individuals gain skills and stability to overcome food insecurity."
    },
    "nutritionAndWellness": {
      "description": "We distribute healthy food to improve community health.",
      "details": "We focus on providing fresh fruits and vegetables, fiber-rich food, and education on healthy living."
    },
    "farmsAndGardening": {
      "description": "We partner with local farms and maintain an urban garden.",
      "details": "Our partnerships provide fresh produce, and we also teach community members how to grow food in small gardens or pots."
    },
    "foodAccessInitiatives": {
      "description": "We work to improve food access in the region.",
      "details": "We aim to make quality, affordable food more accessible through mobile retail and transportation initiatives."
    }
  },
  "volunteerAndPartnerOpportunities": {
    "description": "We rely on people like you to make a difference.",
    "details": "Our mission to fight hunger and improve food security requires the help of dedicated partners, contributors, and volunteers."
  }

}

const FAQ =
{
  "locations": [
    {
      "state": "District of Columbia",
      "address": "4900 Puerto Rico Avenue, NE",
      "city": "Washington",
      "zip": "DC 20017",
      "phone": "(202) 644-9800",
      "fax": "(202) 529-1767",
      "directions": "Directions"
    },
    {
      "state": "Virginia",
      "address": "6833 Hill Park Drive",
      "city": "Lorton",
      "zip": "VA 22079",
      "phone": "(571) 482-4770",
      "fax": "(703) 541-0179",
      "directions": "Directions"
    }
  ]
}


function getSessionId(req: NextRequest): string {
  let sessionId = req.headers.get('session-id');
  if (!sessionId) {
    sessionId = crypto.randomUUID(); // Generate a new session ID
  }
  return sessionId;
}

export async function POST(req: NextRequest) {
  const { message, sessionId } = await req.json();
  console.log(sessionId);
  // Retrieve or initialize session data
  let messages;

  const existingSession = await prisma.chat_session.findUnique({
    where: { sessionId },
  });

  if (existingSession?.messages) {
    messages = existingSession.messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[];
  } else {
    messages = [
      {
        role: 'system',
        content: systemPrompt({
          donation_prompts,
          what_we_do_prompts,
          FAQ,
        }),
      },
    ];
  }
  messages.push({ role: 'user', content: message });
  // Fetch response from OpenAI
  const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: messages,
    }),
  });
  const data = await openAiResponse.json();
  const botReply = data.choices[0].message.content;
  console.log(botReply);
  // Append assistant's reply to messages and store in the session
  messages.push({ role: 'assistant', content: botReply });

  await prisma.chat_session.upsert({
    where: { sessionId },
    update: { messages },
    create: { sessionId, messages },
  });

  return NextResponse.json({ reply: botReply, sessionId: sessionId }, { headers: { 'session-id': sessionId } });
}
