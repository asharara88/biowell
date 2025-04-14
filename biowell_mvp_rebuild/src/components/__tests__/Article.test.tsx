import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Article from '../Article';

describe('Article', () => {
  const sampleContent = `
    # Test Article
    
    This is a test article with enough content to generate a reading time estimate.
    It contains multiple paragraphs to ensure accurate estimation.
    
    ## Section 1
    
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    
    ## Section 2
    
    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
    eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt 
    in culpa qui officia deserunt mollit anim id est laborum.
  `;

  it('renders article content', () => {
    render(<Article content={sampleContent} />);
    expect(screen.getByRole('article')).toBeInTheDocument();
    expect(screen.getByText(/Test Article/)).toBeInTheDocument();
  });

  it('displays reading time estimate', () => {
    render(<Article content={sampleContent} />);
    expect(screen.getByText(/min/)).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Article content={sampleContent} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});