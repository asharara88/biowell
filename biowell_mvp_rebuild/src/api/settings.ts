import { supabase } from './client';
import { toast } from 'react-toastify';

export interface UserSettings {
  tone: 'friendly' | 'professional' | 'motivational';
  detailLevel: 'standard' | 'detailed';
}

export async function saveUserSettings(userId: string, settings: UserSettings): Promise<UserSettings> {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .upsert({ 
        user_id: userId,
        tone: settings.tone,
        detail_level: settings.detailLevel,
        updated_at: new Date().toISOString()
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error('Supabase error saving settings:', error);
      throw new Error('Failed to save settings');
    }

    if (!data) {
      throw new Error('No data returned after saving settings');
    }

    return {
      tone: data.tone,
      detailLevel: data.detail_level
    };
  } catch (error) {
    toast.error('Failed to save settings');
    throw error;
  }
}

export async function getUserSettings(userId: string): Promise<UserSettings | null> {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('tone, detail_level')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Supabase error fetching settings:', error);
      throw new Error('Failed to fetch settings');
    }

    if (!data) {
      return null;
    }

    return {
      tone: data.tone,
      detailLevel: data.detail_level
    };
  } catch (error) {
    toast.error('Failed to load settings');
    console.error('Error getting user settings:', error);
    return null;
  }
}