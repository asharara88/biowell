import { supabase } from './client';
import { toast } from 'react-toastify';

// Types for wearable data
export interface WearableData {
  id?: string;
  user_id?: string;
  device_id: string;
  device_type: 'fitbit' | 'garmin' | 'apple_health' | 'freestyle_libre';
  last_sync: Date | string;
  metrics: Record<string, unknown>;
}

// Types for CGM data
export interface CGMData {
  id?: string;
  user_id?: string;
  timestamp: Date | string;
  glucose: number;
  trend?: 'rising' | 'falling' | 'stable';
}

export class WearableIntegration {
  static async fetchWearableData(userId: string): Promise<WearableData | null> {
    try {
      const { data, error } = await supabase
        .from('wearable_data')
        .select('*')
        .eq('user_id', userId)
        .order('last_sync', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching wearable data:', error);
        toast.error('Failed to fetch wearable data');
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error in fetchWearableData:', error);
      toast.error('An error occurred while fetching wearable data');
      return null;
    }
  }

  static async connectDevice(userId: string, deviceType: WearableData['device_type'], deviceId: string): Promise<WearableData | null> {
    try {
      const { data, error } = await supabase
        .from('wearable_data')
        .upsert({
          user_id: userId,
          device_type: deviceType,
          device_id: deviceId,
          last_sync: new Date().toISOString(),
          metrics: {}
        })
        .select()
        .single();

      if (error) {
        console.error('Error connecting device:', error);
        toast.error('Failed to connect device');
        return null;
      }
      
      toast.success(`${deviceType} connected successfully`);
      return data;
    } catch (error) {
      console.error('Error in connectDevice:', error);
      toast.error('An error occurred while connecting device');
      return null;
    }
  }

  static async syncData(userId: string, deviceId: string): Promise<boolean> {
    try {
      // Get current date/time
      const now = new Date().toISOString();
      
      // Update last_sync timestamp
      const { error } = await supabase
        .from('wearable_data')
        .update({ last_sync: now })
        .eq('user_id', userId)
        .eq('device_id', deviceId);

      if (error) {
        console.error('Error syncing data:', error);
        toast.error('Failed to sync device data');
        return false;
      }
      
      toast.success('Device data synced successfully');
      return true;
    } catch (error) {
      console.error('Error in syncData:', error);
      toast.error('An error occurred while syncing data');
      return false;
    }
  }
}

export class CGMIntegration {
  static async fetchCGMData(userId: string): Promise<CGMData[]> {
    try {
      const { data, error } = await supabase
        .from('cgm_data')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(24); // Last 24 readings

      if (error) {
        console.error('Error fetching CGM data:', error);
        toast.error('Failed to fetch CGM data');
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in fetchCGMData:', error);
      toast.error('An error occurred while fetching CGM data');
      return [];
    }
  }

  static async getLatestReading(userId: string): Promise<CGMData | null> {
    try {
      const { data, error } = await supabase
        .from('cgm_data')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching latest CGM reading:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error in getLatestReading:', error);
      return null;
    }
  }

  static async addReading(userId: string, reading: Omit<CGMData, 'id' | 'user_id'>): Promise<CGMData | null> {
    try {
      const { data, error } = await supabase
        .from('cgm_data')
        .insert({
          user_id: userId,
          ...reading
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding CGM reading:', error);
        toast.error('Failed to add CGM reading');
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error in addReading:', error);
      toast.error('An error occurred while adding CGM reading');
      return null;
    }
  }
}