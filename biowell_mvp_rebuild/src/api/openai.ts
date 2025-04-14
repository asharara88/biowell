import { handleError } from '../utils/error-handling';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionResponse {
  id: string;
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

const SYSTEM_PROMPT = `You are a Personal Digital Coach specializing in health, fitness, supplements, and wellness.

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
- Include specific, measurable recommendations
- Prioritize safety and proper dosing
- Encourage gradual progression`;

interface OpenAIOptions {
  language?: string;
  goal?: string;
  metrics?: {
    glucose?: number;
    heartRate?: number;
    sleep?: {
      duration: number;
      quality: number;
    };
  };
}

export async function fetchOpenAIResponse(prompt: string, options: OpenAIOptions = {}): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not found in environment variables');
  }

  let systemPrompt = SYSTEM_PROMPT;
  
  if (options.goal) {
    systemPrompt += `\n\nCurrent user goal: ${options.goal}`;
  }

  if (options.metrics) {
    systemPrompt += '\n\nCurrent health metrics:';
    if (options.metrics.glucose) {
      systemPrompt += `\n- Glucose: ${options.metrics.glucose} mg/dL`;
    }
    if (options.metrics.heartRate) {
      systemPrompt += `\n- Heart Rate: ${options.metrics.heartRate} bpm`;
    }
    if (options.metrics.sleep) {
      systemPrompt += `\n- Sleep Duration: ${options.metrics.sleep.duration} hours`;
      systemPrompt += `\n- Sleep Quality: ${options.metrics.sleep.quality}/10`;
    }
  }

  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    { 
      role: 'user', 
      content: options.language === 'ar' ? `أجب باللغة العربية: ${prompt}` : prompt 
    }
  ];

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages,
        max_tokens: 500,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        user: options.goal ? `goal:${options.goal}` : undefined
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || 
        `OpenAI API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json() as ChatCompletionResponse;
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from OpenAI');
    }

    return data.choices[0].message.content;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out after 30 seconds');
    }
    handleError(error, 'OpenAI API');
    throw error;
  }
}