import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "npm:openai@4.28.0";

// Define CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-openai-key",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

// Define request payload interface
interface RequestPayload {
  userId: string;
  message: string;
  goal?: string;
  language?: 'en' | 'ar';
}

// Rate limiting setup
const RATE_LIMIT_WINDOW_MS = 10000; // 10 seconds
const rateLimitMap = new Map<string, number>();

function isRateLimited(ip: string): boolean {
  const currentTime = Date.now();
  const lastRequestTime = rateLimitMap.get(ip);

  // Clean up old entries
  for (const [key, timestamp] of rateLimitMap.entries()) {
    if (currentTime - timestamp > RATE_LIMIT_WINDOW_MS) {
      rateLimitMap.delete(key);
    }
  }

  if (!lastRequestTime || currentTime - lastRequestTime > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, currentTime);
    return false;
  }

  return true;
}

serve(async (req: Request) => {
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

    if (!userId || !message) {
      throw new Error("User ID and message are required");
    }

    // Get OpenAI API key from request header
    const apiKey = req.headers.get('x-openai-key');
    if (!apiKey) {
      throw new Error("OpenAI API key not found in request headers");
    }

    console.log("Using OpenAI API key:", apiKey.substring(0, 5) + "..." + apiKey.substring(apiKey.length - 4));

    const openai = new OpenAI({ apiKey });

    // Prepare system prompt based on language
    const languagePrefix = language === 'ar' ? 'أجب باللغة العربية:' : '';
    const systemPrompt = language === 'ar' 
      ? `أنت مستشار صحي متخصص في تقديم توصيات شخصية للعافية. ${goal ? `هدف المستخدم الرئيسي هو: ${goal}.` : ''}`
      : `You are a knowledgeable health consultant specializing in personalized wellness recommendations. ${goal ? `The user's primary goal is: ${goal}.` : ''}

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
- Keep responses concise and actionable
- Use clear, jargon-free language
- Include specific, measurable recommendations`;

    console.log("Sending request to OpenAI with system prompt:", systemPrompt.substring(0, 100) + "...");
    console.log("User message:", message);

    // Generate response using OpenAI
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

    console.log("Received response from OpenAI:", assistantResponse.substring(0, 100) + "...");

    // Return the response
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
    console.error('Error in health coach function:', error);
    
    return new Response(
      JSON.stringify({
        error: error.message,
        details: 'Failed to generate health consultant response'
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