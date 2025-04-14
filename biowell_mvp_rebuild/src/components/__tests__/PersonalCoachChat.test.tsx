import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PersonalCoachChat from '../PersonalCoachChat';
import { TestWrapper } from '../../test/utils';
import * as coachApi from '../../api/coach';

// Mock scrollIntoView
HTMLElement.prototype.scrollIntoView = vi.fn();

vi.mock('../../api/coach', () => ({
  saveMessage: vi.fn(),
  getConversationHistory: vi.fn(),
  generateCoachResponse: vi.fn()
}));

describe('PersonalCoachChat', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set default mock implementations
    vi.mocked(coachApi.getConversationHistory).mockResolvedValue(
      Promise.resolve([])
    );
  });

  it('renders initial welcome message', async () => {
    render(<PersonalCoachChat />, { wrapper: TestWrapper });
    
    await waitFor(() => {
      expect(screen.getByText(/Welcome!/)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Ask your wellness coach/)).toBeInTheDocument();
    });
  });

  it('handles sending a message', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      id: '123',
      role: 'coach',
      content: 'Test response',
      metadata: { type: 'text' }
    };

    vi.mocked(coachApi.generateCoachResponse).mockResolvedValueOnce(
      Promise.resolve(mockResponse)
    );
    vi.mocked(coachApi.saveMessage).mockResolvedValueOnce(
      Promise.resolve({ id: '456', role: 'user', content: 'Test message', metadata: {} })
    );
    
    render(<PersonalCoachChat />, { wrapper: TestWrapper });
    
    const input = screen.getByPlaceholderText(/Ask your wellness coach/);
    await user.type(input, 'Test message');
    await user.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(screen.getByText('Test response')).toBeInTheDocument();
    });
  });

  it('displays error message when API call fails', async () => {
    const user = userEvent.setup();
    vi.mocked(coachApi.generateCoachResponse).mockRejectedValueOnce(
      Promise.reject(new Error('API Error'))
    );
    vi.mocked(coachApi.saveMessage).mockResolvedValueOnce(
      Promise.resolve({ id: '456', role: 'user', content: 'Test message', metadata: {} })
    );
    
    render(<PersonalCoachChat />, { wrapper: TestWrapper });
    
    const input = screen.getByPlaceholderText(/Ask your wellness coach/);
    await user.type(input, 'Test message');
    await user.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(screen.getByText(/Failed to get coach response/)).toBeInTheDocument();
    });
  });

  it('handles goal selection', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      id: '123',
      role: 'coach',
      content: 'Goal-specific response',
      metadata: { type: 'text', goal: 'Energy & Focus' }
    };

    vi.mocked(coachApi.generateCoachResponse).mockResolvedValueOnce(
      Promise.resolve(mockResponse)
    );
    vi.mocked(coachApi.saveMessage).mockResolvedValueOnce(
      Promise.resolve({ 
        id: '456', 
        role: 'user', 
        content: 'I want to focus on Energy & Focus', 
        metadata: { goal: 'Energy & Focus' } 
      })
    );
    
    render(<PersonalCoachChat />, { wrapper: TestWrapper });
    
    const goalButton = screen.getByRole('button', { name: /Energy & Focus/i });
    await user.click(goalButton);

    await waitFor(() => {
      expect(screen.getByText('Goal-specific response')).toBeInTheDocument();
    });
  });
});