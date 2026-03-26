import OpenAI from "openai";
import Notification from "../models/Notification.js";

/* =========================
   AI System Prompt
========================= */

const SYSTEM_PROMPT = `
You are Flikkc AI Notification Writer.

Rules:
- Generate neutral, informative notifications.
- Do NOT pressure users.
- Do NOT promise winnings.
- Do NOT use urgency phrases like "hurry", "last chance".
- Tone must be calm, professional, and transparent.
`;

/* =========================
   Generate AI Notification
========================= */

export const generateAINotification = async (req, res) => {

  try {

    const { context } = req.body;

    if (!context) {
      return res.status(400).json({
        message: "Context is required"
      });
    }

    const response = await openai.chat.completions.create({

      model: "gpt-4o-mini",

      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Create a short in-app notification based on this context:\n${context}`
        }
      ],

      temperature: 0.3,
      max_tokens: 80

    });

    const message = response.choices?.[0]?.message?.content?.trim();

    if (!message) {
      return res.status(500).json({
        message: "AI failed to generate notification"
      });
    }

    res.json({
      notification: message
    });

  } catch (error) {

    console.error("AI Notification Error:", error);

    res.status(500).json({
      message: "AI notification generation failed"
    });

  }
  
  const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
};