import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react';
import { useArticle } from '../../hooks/useArticle';

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { article, loading, error } = useArticle(slug!);

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-biowellGreen"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-black pt-16 px-4">
        <div className="max-w-4xl mx-auto py-8">
          <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg">
            {error || 'Article not found'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-16">
      <Helmet>
        <title>{`${article.title} - BIOWELL Articles`}</title>
        <meta name="description" content={article.excerpt} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <article className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => navigate('/articles')}
            className="flex items-center text-biowellGreen mb-8 hover:text-biowellGreen/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Articles
          </button>

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              {article.title}
            </h1>

            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <time dateTime={article.date}>
                  {format(new Date(article.date), 'MMMM d, yyyy')}
                </time>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {article.readingTime}
              </div>
              <div className="flex items-center">
                <Tag className="w-4 h-4 mr-2" />
                {article.category}
              </div>
            </div>
          </div>

          {article.coverImage && (
            <div className="mb-8 rounded-xl overflow-hidden">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-[400px] object-cover"
              />
            </div>
          )}

          <div className="prose prose-lg prose-invert max-w-none">
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>
        </motion.div>
      </article>
    </div>
  );
}