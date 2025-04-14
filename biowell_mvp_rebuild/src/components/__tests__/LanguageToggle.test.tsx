import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LanguageToggle from '../LanguageToggle';
import { useLanguageStore } from '../../store/languageStore';

// Mock the language store
vi.mock('../../store/languageStore', () => ({
  useLanguageStore: vi.fn()
}));

describe('LanguageToggle', () => {
  beforeEach(() => {
    // Reset mock implementation before each test
    vi.mocked(useLanguageStore).mockImplementation(() => ({
      language: 'en',
      setLanguage: vi.fn()
    }));
  });

  it('renders with English as default language', () => {
    render(<LanguageToggle />);
    expect(screen.getByText('العربية')).toBeInTheDocument();
  });

  it('renders with Arabic when language is set to ar', () => {
    vi.mocked(useLanguageStore).mockImplementation(() => ({
      language: 'ar',
      setLanguage: vi.fn()
    }));

    render(<LanguageToggle />);
    expect(screen.getByText('English')).toBeInTheDocument();
  });

  it('calls setLanguage when clicked', () => {
    const setLanguage = vi.fn();
    vi.mocked(useLanguageStore).mockImplementation(() => ({
      language: 'en',
      setLanguage
    }));

    render(<LanguageToggle />);
    fireEvent.click(screen.getByRole('button'));
    expect(setLanguage).toHaveBeenCalledWith('ar');
  });

  it('toggles between languages', () => {
    const setLanguage = vi.fn();
    vi.mocked(useLanguageStore).mockImplementation(() => ({
      language: 'en',
      setLanguage
    }));

    render(<LanguageToggle />);
    fireEvent.click(screen.getByRole('button'));
    expect(setLanguage).toHaveBeenCalledWith('ar');

    // Update mock to simulate language change
    vi.mocked(useLanguageStore).mockImplementation(() => ({
      language: 'ar',
      setLanguage
    }));

    render(<LanguageToggle />);
    fireEvent.click(screen.getByRole('button'));
    expect(setLanguage).toHaveBeenCalledWith('en');
  });
});