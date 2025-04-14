import { useState, useEffect } from 'react';
import readTimeEstimate from 'read-time-estimate';

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  coverImage?: string;
  readingTime: string;
}

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadArticles() {
      try {
        // In a real app, this would be an API call
        const articleFiles = import.meta.glob('../pages/Blog/articles/*.md', { query: '?raw', import: 'default' });
        
        const loadedArticles = await Promise.all(
          Object.entries(articleFiles).map(async ([path, importFn]) => {
            const content = await importFn();
            const slug = path.split('/').pop()?.replace('.md', '') || '';
            const title = content.split('\n')[0].replace('# ', '');
            const excerpt = content.split('\n')[2];
            const { humanizedDuration } = readTimeEstimate(content);
            
            return {
              slug,
              title,
              excerpt,
              content,
              date: new Date().toISOString(), // In real app, this would come from frontmatter
              category: 'Wellness',
              readingTime: humanizedDuration,
            };
          })
        );

        setArticles(loadedArticles);
      } catch (err) {
        setError('Failed to load articles');
        console.error('Error loading articles:', err);
      } finally {
        setLoading(false);
      }
    }

    loadArticles();
  }, []);

  return { articles, loading, error };
}