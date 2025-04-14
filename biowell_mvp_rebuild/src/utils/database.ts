```typescript
import { supabase } from '../api/client';
import { handleError } from './error-handling';

export interface FetchOptions {
  table: string;
  select?: string;
  filters?: Record<string, unknown>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
  single?: boolean;
}

export async function fetchFromDB<T>({ 
  table,
  select = '*',
  filters = {},
  orderBy,
  limit,
  single = false
}: FetchOptions): Promise<T | T[] | null> {
  try {
    let query = supabase
      .from(table)
      .select(select);

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });

    // Apply ordering
    if (orderBy) {
      query = query.order(orderBy.column, { 
        ascending: orderBy.ascending ?? true 
      });
    }

    // Apply limit
    if (limit) {
      query = query.limit(limit);
    }

    // Get single result if requested
    if (single) {
      const { data, error } = await query.single();
      if (error) throw error;
      return data as T;
    }

    // Get multiple results
    const { data, error } = await query;
    if (error) throw error;
    return data as T[];

  } catch (error) {
    handleError(error, 'fetchFromDB');
    return null;
  }
}

export async function insertToDB<T>(
  table: string,
  data: Partial<T>
): Promise<T | null> {
  try {
    const { data: result, error } = await supabase
      .from(table)
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return result as T;
  } catch (error) {
    handleError(error, 'insertToDB');
    return null;
  }
}

export async function updateInDB<T>(
  table: string,
  id: string,
  data: Partial<T>
): Promise<T | null> {
  try {
    const { data: result, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return result as T;
  } catch (error) {
    handleError(error, 'updateInDB');
    return null;
  }
}

export async function deleteFromDB(
  table: string,
  id: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    handleError(error, 'deleteFromDB');
    return false;
  }
}
```