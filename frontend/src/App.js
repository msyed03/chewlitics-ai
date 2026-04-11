import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import MealScanner from './pages/MealScanner';
import MealHistory from './pages/MealHistory';
import NutritionAnalytics from './pages/NutritionAnalytics';
import HabitInsights from './pages/HabitInsights';
import AICoach from './pages/AICoach';
import RecipeGenerator from './pages/RecipeGenerator';
import GroceryPlanner from './pages/GroceryPlanner';
import ProfileGoals from './pages/ProfileGoals';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/meal-scanner" element={<MealScanner />} />
          <Route path="/meal-history" element={<MealHistory />} />
          <Route path="/nutrition-analytics" element={<NutritionAnalytics />} />
          <Route path="/habit-insights" element={<HabitInsights />} />
          <Route path="/ai-coach" element={<AICoach />} />
          <Route path="/recipe-generator" element={<RecipeGenerator />} />
          <Route path="/grocery-planner" element={<GroceryPlanner />} />
          <Route path="/profile" element={<ProfileGoals />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
