import React from 'react';
import { motion } from 'framer-motion';
import { Utensils, Apple, Fish, Leaf, TrendingUp, Clock, Plus } from 'lucide-react';

// Remove unused view prop since we're not using it
interface NutritionWidgetProps {
  className?: string;
}

interface Meal {
  time: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

const meals: Meal[] = [
  {
    time: '08:30',
    name: 'Breakfast',
    calories: 450,
    protein: 25,
    carbs: 45,
    fat: 20,
    type: 'breakfast'
  },
  {
    time: '13:00',
    name: 'Lunch',
    calories: 650,
    protein: 35,
    carbs: 65,
    fat: 25,
    type: 'lunch'
  },
  {
    time: '16:00',
    name: 'Snack',
    calories: 200,
    protein: 10,
    carbs: 25,
    fat: 8,
    type: 'snack'
  }
];

const dailyGoals = {
  calories: 2200,
  protein: 140,
  carbs: 275,
  fat: 73
};

export default function NutritionWidget({ className = '' }: NutritionWidgetProps) {
  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFat = meals.reduce((sum, meal) => sum + meal.fat, 0);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gray-900 rounded-xl p-6 border border-gray-800 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-green-400/10 rounded-lg flex items-center justify-center">
            <Utensils className="w-5 h-5 text-green-400" />
          </div>
          <div className="ml-3">
            <h2 className="text-xl font-semibold text-white">Nutrition</h2>
            <div className="flex items-center text-sm text-gray-400">
              <Clock className="w-4 h-4 mr-1" />
              <span>Today's tracking</span>
            </div>
          </div>
        </div>
        <div className="flex items-center text-sm">
          <TrendingUp className="w-4 h-4 mr-1 text-green-400" />
          <span className="text-gray-400">On track</span>
        </div>
      </div>

      {/* Macros Overview */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-3 gap-4 mb-6"
      >
        <motion.div variants={item} className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Fish className="w-4 h-4 text-red-400" />
            <span className="text-gray-400">Protein</span>
          </div>
          <div className="text-xl font-bold text-white">
            {totalProtein}g
            <span className="text-sm text-gray-400 ml-1">/ {dailyGoals.protein}g</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
            <div
              className="bg-red-400 h-1 rounded-full"
              style={{ width: `${(totalProtein / dailyGoals.protein) * 100}%` }}
            />
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Apple className="w-4 h-4 text-blue-400" />
            <span className="text-gray-400">Carbs</span>
          </div>
          <div className="text-xl font-bold text-white">
            {totalCarbs}g
            <span className="text-sm text-gray-400 ml-1">/ {dailyGoals.carbs}g</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
            <div
              className="bg-blue-400 h-1 rounded-full"
              style={{ width: `${(totalCarbs / dailyGoals.carbs) * 100}%` }}
            />
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="w-4 h-4 text-yellow-400" />
            <span className="text-gray-400">Fats</span>
          </div>
          <div className="text-xl font-bold text-white">
            {totalFat}g
            <span className="text-sm text-gray-400 ml-1">/ {dailyGoals.fat}g</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
            <div
              className="bg-yellow-400 h-1 rounded-full"
              style={{ width: `${(totalFat / dailyGoals.fat) * 100}%` }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Calories Progress */}
      <motion.div variants={item} className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400">Total Calories</span>
          <span className="text-white font-medium">
            {totalCalories} / {dailyGoals.calories} kcal
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-green-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(totalCalories / dailyGoals.calories) * 100}%` }}
          />
        </div>
      </motion.div>

      {/* Meal List */}
      <div className="space-y-4">
        {meals.map((meal, index) => (
          <motion.div
            key={meal.time}
            variants={item}
            className="bg-gray-800 rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="text-gray-400">{meal.time}</div>
              <div>
                <div className="text-white font-medium">{meal.name}</div>
                <div className="text-sm text-gray-400">
                  {meal.calories} kcal • {meal.protein}g protein
                </div>
              </div>
            </div>
            <div className={`px-2 py-1 rounded text-xs ${
              meal.type === 'breakfast' ? 'bg-blue-400/20 text-blue-400' :
              meal.type === 'lunch' ? 'bg-green-400/20 text-green-400' :
              meal.type === 'dinner' ? 'bg-purple-400/20 text-purple-400' :
              'bg-yellow-400/20 text-yellow-400'
            }`}>
              {meal.type}
            </div>
          </motion.div>
        ))}

        <button className="w-full mt-4 bg-gray-800 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Add Meal</span>
        </button>
      </div>
    </motion.div>
  );
}