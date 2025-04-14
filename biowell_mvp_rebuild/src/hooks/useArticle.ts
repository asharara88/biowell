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

export function useArticle(slug: string) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadArticle() {
      try {
        // In a real app, this would be an API call
        const articleFiles = import.meta.glob('../pages/Blog/articles/*.md', { query: '?raw', import: 'default' });
        const articlePath = Object.keys(articleFiles).find(path => path.includes(slug));

        if (!articlePath || !articleFiles[articlePath]) {
          throw new Error('Article not found');
        }

        const content = await articleFiles[articlePath]();
        const title = content.split('\n')[0].replace('# ', '');
        const excerpt = content.split('\n')[2];
        const { humanizedDuration } = readTimeEstimate(content);

        setArticle({
          slug,
          title,
          excerpt,
          content,
          date: new Date().toISOString(), // In real app, this would come from frontmatter
          category: 'Wellness',
          readingTime: humanizedDuration,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load article');
        console.error('Error loading article:', err);
      } finally {
        setLoading(false);
      }
    }

    loadArticle();
  }, [slug]);

  return { article, loading, error };
}