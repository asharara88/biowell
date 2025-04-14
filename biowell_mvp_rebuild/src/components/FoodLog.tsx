import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Clock, Utensils, LineChart, Loader2, X } from 'lucide-react';
import { supabase } from '../api/client';

interface FoodLogEntry {
  id: string;
  meal_time: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  food_name: string;
  portion_size?: string;
  calories?: number;
  carbohydrates?: number;
  protein?: number;
  fat?: number;
  notes?: string;
  pre_glucose?: number;
  post_glucose?: number;
  glucose_impact?: number;
}

export default function FoodLog() {
  const [entries, setEntries] = useState<FoodLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<FoodLogEntry>>({
    meal_type: 'breakfast',
    food_name: '',
    portion_size: '',
    calories: undefined,
    carbohydrates: undefined,
    protein: undefined,
    fat: undefined,
    notes: '',
  });

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('food_logs')
        .select('*')
        .order('meal_time', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching food logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('food_logs')
        .insert([{ ...formData, meal_time: new Date().toISOString() }]);

      if (error) throw error;

      setShowForm(false);
      setFormData({
        meal_type: 'breakfast',
        food_name: '',
        portion_size: '',
        calories: undefined,
        carbohydrates: undefined,
        protein: undefined,
        fat: undefined,
        notes: '',
      });
      fetchEntries();
    } catch (error) {
      console.error('Error saving food log:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">Food Log</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-biowellGreen text-black px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-opacity-90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Entry
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">New Food Entry</h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Meal Type
                  </label>
                  <select
                    value={formData.meal_type}
                    onChange={(e) => setFormData({ ...formData, meal_type: e.target.value as any })}
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-biowellGreen"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Food Name
                  </label>
                  <input
                    type="text"
                    value={formData.food_name}
                    onChange={(e) => setFormData({ ...formData, food_name: e.target.value })}
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-biowellGreen"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Portion Size
                  </label>
                  <input
                    type="text"
                    value={formData.portion_size}
                    onChange={(e) => setFormData({ ...formData, portion_size: e.target.value })}
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-biowellGreen"
                    placeholder="e.g., 1 cup, 100g"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Calories
                  </label>
                  <input
                    type="number"
                    value={formData.calories || ''}
                    onChange={(e) => setFormData({ ...formData, calories: parseInt(e.target.value) })}
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-biowellGreen"
                    placeholder="kcal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Carbohydrates (g)
                  </label>
                  <input
                    type="number"
                    value={formData.carbohydrates || ''}
                    onChange={(e) => setFormData({ ...formData, carbohydrates: parseFloat(e.target.value) })}
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-biowellGreen"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    value={formData.protein || ''}
                    onChange={(e) => setFormData({ ...formData, protein: parseFloat(e.target.value) })}
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-biowellGreen"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Fat (g)
                  </label>
                  <input
                    type="number"
                    value={formData.fat || ''}
                    onChange={(e) => setFormData({ ...formData, fat: parseFloat(e.target.value) })}
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-biowellGreen"
                    step="0.1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-biowellGreen"
                  rows={3}
                  placeholder="Add any additional notes..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-biowellGreen text-black px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Save Entry
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-biowellGreen" />
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          No food entries yet. Start logging your meals!
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{entry.food_name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(entry.meal_time).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Utensils className="w-4 h-4" />
                      {entry.meal_type}
                    </div>
                  </div>
                </div>
                {entry.glucose_impact !== null && (
                  <div className={`flex items-center gap-2 ${
                    entry.glucose_impact! > 30 ? 'text-red-400' :
                    entry.glucose_impact! > 15 ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>
                    <LineChart className="w-5 h-5" />
                    {entry.glucose_impact} mg/dL
                  </div>
                )}
              </div>

              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-400">Calories</div>
                  <div className="text-lg font-semibold text-white">{entry.calories || '-'}</div>
                </div>
                <div className="text-center p-3 bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-400">Carbs</div>
                  <div className="text-lg font-semibold text-white">{entry.carbohydrates || '-'}g</div>
                </div>
                <div className="text-center p-3 bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-400">Protein</div>
                  <div className="text-lg font-semibold text-white">{entry.protein || '-'}g</div>
                </div>
                <div className="text-center p-3 bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-400">Fat</div>
                  <div className="text-lg font-semibold text-white">{entry.fat || '-'}g</div>
                </div>
              </div>

              {entry.notes && (
                <div className="text-gray-400 text-sm">
                  {entry.notes}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}