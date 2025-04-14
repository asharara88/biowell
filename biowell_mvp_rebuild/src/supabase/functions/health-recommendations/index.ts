import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

interface HealthMetrics {
  glucose?: number;
  heartRate?: number;
  steps?: number;
  sleep?: {
    duration: number;
    quality: number;
  };
  stress?: number;
  energy?: number;
}

interface Recommendation {
  type: 'supplement' | 'habit' | 'lifestyle';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionItems: string[];
  metrics: {
    target: string;
    current: string;
    unit: string;
  }[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, metrics } = await req.json() as { 
      userId: string;
      metrics: HealthMetrics;
    };

    if (!userId) {
      throw new Error("User ID is required");
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        }
      }
    );

    // Fetch user's historical data
    const { data: healthHistory, error: healthError } = await supabaseClient
      .from('health_metrics')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(24);

    if (healthError) {
      throw new Error(`Failed to fetch health history: ${healthError.message}`);
    }

    // Analyze metrics and generate recommendations
    const recommendations: Recommendation[] = [];

    // Glucose Analysis
    if (metrics.glucose) {
      if (metrics.glucose > 140) {
        recommendations.push({
          type: 'lifestyle',
          priority: 'high',
          title: 'Blood Sugar Management',
          description: 'Your glucose levels are elevated. Consider these strategies to maintain healthy blood sugar levels.',
          actionItems: [
            'Take a 10-minute walk after meals',
            'Include fiber-rich foods in your meals',
            'Consider chromium and berberine supplements',
            'Practice stress management techniques'
          ],
          metrics: [{
            target: '80-120',
            current: metrics.glucose.toString(),
            unit: 'mg/dL'
          }]
        });
      }
    }

    // Heart Rate Analysis
    if (metrics.heartRate) {
      if (metrics.heartRate > 100) {
        recommendations.push({
          type: 'lifestyle',
          priority: 'medium',
          title: 'Heart Rate Optimization',
          description: 'Your resting heart rate is elevated. Consider these heart-healthy strategies.',
          actionItems: [
            'Practice deep breathing exercises',
            'Maintain regular cardiovascular exercise',
            'Consider magnesium supplementation',
            'Ensure adequate sleep'
          ],
          metrics: [{
            target: '60-100',
            current: metrics.heartRate.toString(),
            unit: 'bpm'
          }]
        });
      }
    }

    // Sleep Analysis
    if (metrics.sleep) {
      if (metrics.sleep.duration < 7) {
        recommendations.push({
          type: 'habit',
          priority: 'high',
          title: 'Sleep Optimization',
          description: 'Your sleep duration is below optimal levels. Focus on these sleep-enhancing strategies.',
          actionItems: [
            'Establish a consistent sleep schedule',
            'Create a relaxing bedtime routine',
            'Consider magnesium glycinate supplementation',
            'Limit blue light exposure before bed'
          ],
          metrics: [{
            target: '7-9',
            current: metrics.sleep.duration.toString(),
            unit: 'hours'
          }]
        });
      }
    }

    // Stress Management
    if (metrics.stress && metrics.stress > 7) {
      recommendations.push({
        type: 'supplement',
        priority: 'medium',
        title: 'Stress Management Protocol',
        description: 'Your stress levels are elevated. Consider these stress-reducing supplements and practices.',
        actionItems: [
          'Ashwagandha (300-600mg daily)',
          'L-Theanine (200mg as needed)',
          'Daily meditation practice',
          'Regular exercise routine'
        ],
        metrics: [{
          target: '< 5',
          current: metrics.stress.toString(),
          unit: '/10'
        }]
      });
    }

    // Energy Optimization
    if (metrics.energy && metrics.energy < 6) {
      recommendations.push({
        type: 'supplement',
        priority: 'medium',
        title: 'Energy Enhancement Protocol',
        description: 'Your energy levels are below optimal. Consider these energy-supporting strategies.',
        actionItems: [
          'B-Complex supplementation',
          'CoQ10 (100-200mg daily)',
          'Rhodiola Rosea (400-600mg daily)',
          'Regular movement breaks'
        ],
        metrics: [{
          target: '> 7',
          current: metrics.energy.toString(),
          unit: '/10'
        }]
      });
    }

    // Sort recommendations by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    recommendations.sort((a, b) => 
      priorityOrder[a.priority] - priorityOrder[b.priority]
    );

    return new Response(
      JSON.stringify({
        recommendations,
        timestamp: new Date().toISOString(),
        metrics: {
          analyzed: Object.keys(metrics),
          total: recommendations.length
        }
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );

  } catch (error) {
    console.error('Error in health recommendations function:', error);
    
    return new Response(
      JSON.stringify({
        error: error.message,
        details: 'Failed to generate health recommendations'
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});