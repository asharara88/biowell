import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "npm:openai@4.28.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

interface RequestPayload {
  userId: string;
  message: string;
  goal?: string;
  language?: 'en' | 'ar';
}

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 10000; // 10 seconds
const rateLimits = new Map<string, number>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const lastRequest = rateLimits.get(ip);

  // Clear old entries
  for (const [key, timestamp] of rateLimits.entries()) {
    if (now - timestamp > RATE_LIMIT_WINDOW) {
      rateLimits.delete(key);
    }
  }

  if (!lastRequest || now - lastRequest > RATE_LIMIT_WINDOW) {
    rateLimits.set(ip, now);
    return false;
  }

  return true;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting check
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: 'Please wait a few seconds before sending another message'
        }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Retry-After': '10'
          }
        }
      );
    }

    const { userId, message, goal, language = 'en' } = await req.json() as RequestPayload;

    if (!message) {
      throw new Error("Message is required");
    }

    // Get the API key from the request header
    const apiKey = req.headers.get('x-openai-key');
    if (!apiKey) {
      throw new Error('OpenAI API key not found in request headers');
    }

    const openai = new OpenAI({ apiKey });

    const languagePrefix = language === 'ar' ? 'أجب باللغة العربية:' : 'Answer in English:';
    const systemPrompt = language === 'ar' 
      ? `أنت مدرب صحي متخصص في تقديم توصيات شخصية للعافية. ${goal ? `هدف المستخدم الرئيسي هو: ${goal}.` : ''}`
      : `You are a knowledgeable health coach specializing in personalized wellness recommendations. ${goal ? `The user's primary goal is: ${goal}.` : ''}

Key areas of expertise:
- Supplement recommendations and stacking
- Biometric data interpretation (CGM, HRV, sleep metrics)
- Wellness optimization
- Fitness and recovery protocols

Guidelines:
- Provide evidence-based recommendations
- Focus on personalization
- Consider user's specific goals
- Maintain a supportive tone
- Politely decline non-health related questions
- Keep responses concise and actionable`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `${languagePrefix} ${message}` }
      ],
      temperature: 0.7,
      max_tokens: 500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    });

    const assistantResponse = completion.choices[0].message.content;

    if (!assistantResponse) {
      throw new Error(language === 'ar' 
        ? "لم يتم تلقي رد من المساعد"
        : "No response received from assistant"
      );
    }

    return new Response(
      JSON.stringify({
        id: crypto.randomUUID(),
        user_id: userId,
        role: 'coach',
        content: assistantResponse,
        metadata: {
          type: 'text',
          goal: goal || null,
          language
        }
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );

  } catch (error) {
    console.error('Error in coach function:', error);
    
    return new Response(
      JSON.stringify({
        error: error.message,
        details: 'Failed to generate coach response'
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  }
});