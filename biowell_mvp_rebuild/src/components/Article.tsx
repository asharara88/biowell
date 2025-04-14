import React from 'react';
import readTimeEstimate from 'read-time-estimate';
import { Clock } from 'lucide-react';

interface ArticleProps {
  content: string;
  className?: string;
}

const Article: React.FC<ArticleProps> = ({ content, className = '' }) => {
  const { humanizedDuration } = readTimeEstimate(content);

  return (
    <div className={`bg-gray-900 rounded-xl p-6 border border-gray-800 ${className}`}>
      <div className="flex items-center gap-2 text-gray-400 mb-4">
        <Clock className="w-4 h-4" />
        <span className="text-sm">{humanizedDuration}</span>
      </div>
      
      <article className="prose prose-invert max-w-none">
        {content}
      </article>
    </div>
  );
};

export default Article;