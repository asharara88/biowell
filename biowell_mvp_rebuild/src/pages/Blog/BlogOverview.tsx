import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { format } from 'date-fns';
import { Book, Clock, ArrowRight } from 'lucide-react';
import { useArticles } from '../../hooks/useArticles';

export default function BlogOverview() {
  const { articles, loading, error } = useArticles();

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-biowellGreen"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black pt-16 px-4">
        <div className="max-w-4xl mx-auto py-8">
          <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-16">
      <Helmet>
        <title>BIOWELL Articles - Health & Wellness Insights</title>
        <meta name="description" content="Explore the latest insights on personalized health, supplement stacks, and wellness optimization from BIOWELL's expert team." />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Health & Wellness Articles</h1>
          <p className="text-xl text-gray-400">
            Expert knowledge to optimize your wellness journey
          </p>
        </motion.div>

        <div className="grid gap-8">
          {articles.map((article, index) => (
            <motion.article
              key={article.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-biowellGreen transition-colors"
            >
              <Link to={`/blog/${article.slug}`} className="block p-6">
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {article.readingTime}
                  </span>
                  <span className="flex items-center">
                    <Book className="w-4 h-4 mr-1" />
                    {article.category}
                  </span>
                  <time dateTime={article.date}>
                    {format(new Date(article.date), 'MMMM d, yyyy')}
                  </time>
                </div>

                <h2 className="text-2xl font-bold text-white mb-3">
                  {article.title}
                </h2>

                <p className="text-gray-300 mb-4">
                  {article.excerpt}
                </p>

                <div className="flex items-center text-biowellGreen">
                  Read More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}