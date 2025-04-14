```typescript
import { describe, it, expect, vi } from 'vitest';
import { fetchFromDB, insertToDB, updateInDB, deleteFromDB } from '../database';
import { supabase } from '../../api/client';

// Mock supabase client
vi.mock('../../api/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(() => ({
              single: vi.fn(() => ({
                data: { id: '1', name: 'Test' },
                error: null
              }))
            }))
          }))
        })),
        single: vi.fn(() => ({
          data: { id: '1', name: 'Test' },
          error: null
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({
            data: { id: '1', name: 'Test' },
            error: null
          }))
        }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => ({
              data: { id: '1', name: 'Updated' },
              error: null
            }))
          }))
        }))
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({
          error: null
        }))
      }))
    }))
  }
}));

describe('Database Utils', () => {
  describe('fetchFromDB', () => {
    it('fetches single record', async () => {
      const result = await fetchFromDB({
        table: 'test',
        single: true
      });

      expect(result).toEqual({ id: '1', name: 'Test' });
      expect(supabase.from).toHaveBeenCalledWith('test');
    });

    it('handles filters', async () => {
      await fetchFromDB({
        table: 'test',
        filters: { id: '1' }
      });

      const fromFn = vi.mocked(supabase.from);
      expect(fromFn).toHaveBeenCalledWith('test');
      expect(fromFn().select().eq).toHaveBeenCalledWith('id', '1');
    });

    it('handles ordering', async () => {
      await fetchFromDB({
        table: 'test',
        orderBy: { column: 'name', ascending: true }
      });

      const fromFn = vi.mocked(supabase.from);
      expect(fromFn().select().eq().order).toHaveBeenCalledWith('name', { ascending: true });
    });
  });

  describe('insertToDB', () => {
    it('inserts record', async () => {
      const result = await insertToDB('test', { name: 'Test' });

      expect(result).toEqual({ id: '1', name: 'Test' });
      expect(supabase.from).toHaveBeenCalledWith('test');
    });
  });

  describe('updateInDB', () => {
    it('updates record', async () => {
      const result = await updateInDB('test', '1', { name: 'Updated' });

      expect(result).toEqual({ id: '1', name: 'Updated' });
      expect(supabase.from).toHaveBeenCalledWith('test');
    });
  });

  describe('deleteFromDB', () => {
    it('deletes record', async () => {
      const result = await deleteFromDB('test', '1');

      expect(result).toBe(true);
      expect(supabase.from).toHaveBeenCalledWith('test');
    });
  });
});
```