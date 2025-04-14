import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  imageSrc?: string;
  route?: string;
}

export default function FeatureCard({ title, description, icon, imageSrc, route }: FeatureCardProps) {
  const cardContent = (
    <>
      {imageSrc && (
        <div className="h-48 overflow-hidden">
          <motion.img 
            src={imageSrc} 
            alt={title} 
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          {icon && (
            <div className="p-2 bg-biowellGreen/10 rounded-lg">
              {React.cloneElement(icon as React.ReactElement, {
                className: `text-biowellGreen ${(icon as React.ReactElement).props.className}`
              })}
            </div>
          )}
          <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>
        <p className="text-gray-300 mb-4">{description}</p>
        {route && (
          <div className="flex items-center text-biowellGreen group">
            <span className="mr-2 group-hover:mr-3 transition-all">Learn more</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        )}
      </div>
    </>
  );

  const cardClasses = "bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-biowellGreen transition-all duration-300";

  return route ? (
    <Link to={route} className={cardClasses}>
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
      >
        {cardContent}
      </motion.div>
    </Link>
  ) : (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={cardClasses}
    >
      {cardContent}
    </motion.div>
  );
}