import React, { useState, useEffect, useRef } from 'react';
import {
  TrendingUp,
  Utensils,
  Zap,
  Dumbbell,
  Trophy,
  Goal,
  LayoutDashboard,
  Sparkles,
  Loader2,
  Book,
  Menu,
  X,
  Footprints,
  Volume2,
  Mic,
  Droplet,
  CheckCircle,
} from 'lucide-react';

// Define the types for our data structures
interface DailyProgress {
  day: string;
  calories: number;
  burn: number;
}

interface Nutrient {
  name: string;
  value: number;
  color: string;
}

interface Micronutrient {
  name: string;
  value: number; // e.g., in mg or mcg
  goal: number;
  unit: string;
  isUnhealthy?: boolean; // Flag to indicate if the nutrient is "unhealthy"
}

interface Activity {
  activity: string;
  type: 'Exercise' | 'Diet';
  duration?: string;
  food?: string;
  calories: number;
}

interface Recipe {
  recipeName: string;
  ingredients: string[];
  instructions: string[];
}

interface Exercise {
  name: string;
  sets: string;
  reps: string;
  instructions: string;
}

interface WorkoutPlan {
  goal: string;
  equipment: string;
  exercises: Exercise[];
}

const App: React.FC = () => {
  // Mock data for the dashboard
  const data = {
    caloriesConsumed: 2100,
    caloriesBurned: 550,
    protein: 120,
    carbs: 250,
    fats: 60,
    fiber: 30, // Added fiber mock data
    goalCalories: 2500,
    goalMacros: { // New mock data for macro goals
      protein: 150,
      carbs: 300,
      fats: 70,
      fiber: 40, // Added fiber goal
    },
    initialWaterIntake: 1.5, // Starting water intake in Liters
    goalWater: 3.0, // Water goal in Liters
    dailyProgress: [
      { day: 'Mon', calories: 2200, burn: 450 },
      { day: 'Tue', calories: 2350, burn: 520 },
      { day: 'Wed', calories: 2000, burn: 380 },
      { day: 'Thu', calories: 2100, burn: 550 },
      { day: 'Fri', calories: 2400, burn: 600 },
      { day: 'Sat', calories: 2500, burn: 700 },
      { day: 'Sun', calories: 1850, burn: 300 },
    ] as DailyProgress[],
    nutrients: [
      { name: 'Protein', value: 120, color: '#ff69b4' },
      { name: 'Carbs', value: 250, color: '#FFA500' },
      { name: 'Fats', value: 60, color: '#8b5cf6' },
      { name: 'Fiber', value: 30, color: '#06b6d4' }, // Added fiber to the nutrients array
    ] as Nutrient[],
    // Updated micronutrient list with more nutrients
    micronutrients: [
      { name: 'Vitamin C', value: 90, goal: 100, unit: 'mg' },
      { name: 'Calcium', value: 950, goal: 1000, unit: 'mg' },
      { name: 'Iron', value: 15, goal: 18, unit: 'mg' },
      { name: 'Potassium', value: 3500, goal: 4700, unit: 'mg' },
      { name: 'Sugar', value: 22, goal: 25, unit: 'g', isUnhealthy: true },
      { name: 'Saturated Fat', value: 18, goal: 20, unit: 'g', isUnhealthy: true },
    ] as Micronutrient[],
    recentActivity: [
      { activity: 'Morning Run', type: 'Exercise', duration: '30 min', calories: 350 },
      { activity: 'Lunch', type: 'Diet', food: 'Chicken Salad', calories: 450 },
      { activity: 'Weightlifting', type: 'Exercise', duration: '45 min', calories: 200 },
      { activity: 'Breakfast', type: 'Diet', food: 'Oatmeal', calories: 300 },
    ] as Activity[],
  };

  // State for the sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // State for the Gemini API recipe generator
  const [recipePrompt, setRecipePrompt] = useState<string>('');
  const [recipeResult, setRecipeResult] = useState<Recipe | null>(null);
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState<boolean>(false);
  const [showRecipeError, setShowRecipeError] = useState<boolean>(false);

  // State for the new Gemini API workout plan generator
  const [workoutGoal, setWorkoutGoal] = useState<string>('');
  const [equipment, setEquipment] = useState<string>('');
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [isGeneratingWorkout, setIsGeneratingWorkout] = useState<boolean>(false);
  const [showWorkoutError, setShowWorkoutError] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // State for the new interactive water intake feature
  const [waterIntake, setWaterIntake] = useState<number>(data.initialWaterIntake);
  const [waterGoalReached, setWaterGoalReached] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Function to get the current date for the header
  const getCurrentDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString(undefined, options as Intl.DateTimeFormatOptions);
  };

  // Effect to check if the water goal has been reached
  useEffect(() => {
    if (waterIntake >= data.goalWater) {
      setWaterGoalReached(true);
    } else {
      setWaterGoalReached(false);
    }
  }, [waterIntake, data.goalWater]);

  // Function to log a glass of water
  const handleLogWater = () => {
    setWaterIntake(prev => prev + 0.25); // Add 250ml
  };

  // Function to call the Gemini API for recipe generation
  const generateRecipe = async () => {
    if (!recipePrompt.trim()) return;

    setIsGeneratingRecipe(true);
    setRecipeResult(null);
    setShowRecipeError(false);

    try {
      // Mocked API response for demonstration
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockRecipe: Recipe = {
        recipeName: 'Grilled Lemon Herb Chicken',
        ingredients: [
          '2 boneless, skinless chicken breasts',
          '1 lemon, juiced',
          '2 tbsp olive oil',
          '1 tsp dried oregano',
          '1 tsp dried thyme',
          'Salt and pepper to taste',
          '1 clove garlic, minced'
        ],
        instructions: [
          'In a bowl, mix lemon juice, olive oil, oregano, thyme, minced garlic, salt, and pepper.',
          'Add chicken breasts to the marinade and let sit for at least 30 minutes.',
          'Preheat a grill to medium-high heat.',
          'Grill the chicken for 6-8 minutes per side, or until cooked through.',
          'Serve immediately with a side of steamed vegetables.'
        ]
      };
      setRecipeResult(mockRecipe);

    } catch (error) {
      console.error('Error generating recipe:', error);
      setShowRecipeError(true);
    } finally {
      setIsGeneratingRecipe(false);
    }
  };

  // New function to generate a workout plan
  const generateWorkoutPlan = async () => {
    if (!workoutGoal.trim() || !equipment.trim()) return;

    setIsGeneratingWorkout(true);
    setWorkoutPlan(null);
    setShowWorkoutError(false);

    try {
      // Mocked API response for demonstration
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockWorkout: WorkoutPlan = {
        goal: workoutGoal,
        equipment: equipment,
        exercises: [
          { name: 'Push-ups', sets: '3', reps: '10-12', instructions: 'Start in a plank position. Lower your body until your chest nearly touches the floor. Push yourself back up.' },
          { name: 'Bodyweight Squats', sets: '3', reps: '15-20', instructions: 'Stand with feet shoulder-width apart. Lower your hips as if sitting in a chair. Keep your back straight.' },
          { name: 'Plank', sets: '3', reps: '30-60 sec', instructions: 'Hold your body in a straight line from head to heels. Engage your core.' },
          { name: 'Lunges', sets: '3', reps: '10 per leg', instructions: 'Step forward with one leg, lowering your hips until both knees are bent at a 90-degree angle. Push back to the starting position.' },
        ],
      };
      setWorkoutPlan(mockWorkout);
    } catch (error) {
      console.error('Error generating workout plan:', error);
      setShowWorkoutError(true);
    } finally {
      setIsGeneratingWorkout(false);
    }
  };

  // New function to generate and play TTS audio for the workout plan
  const generateAndPlayWorkoutTTS = async () => {
    if (!workoutPlan) return;
    setIsSpeaking(true);
    const ttsPrompt = `Here is your workout plan: ${workoutPlan.goal} with ${workoutPlan.equipment}. The exercises are: ` +
      workoutPlan.exercises.map(ex => `${ex.name} for ${ex.sets} sets of ${ex.reps} reps. The instructions are: ${ex.instructions}`).join('. ') + '.';
    try {
      console.log('Playing mock audio for workout instructions.');
      await new Promise(resolve => setTimeout(resolve, 5000));
    } catch (error) {
      console.error('Error generating or playing TTS:', error);
    } finally {
      setIsSpeaking(false);
    }
  };

  // Utility to get the color for the nutrient based on the mock data
  const getNutrientColor = (name: string): string => {
    return data.nutrients.find(n => n.name === name)?.color || '#e2e8f0';
  };

  // New placeholder functions for the buttons
  const handleTrackWorkout = () => {
    console.log("Tracking today's workout...");
    // You would add logic here to open a modal or navigate
  };

  const handleLogDiet = () => {
    console.log("Logging today's diet...");
    // You would add logic here to open a modal or navigate
  };

  // Recalculate water percentage using the new state
  const waterPercentage = Math.min(100, (waterIntake / data.goalWater) * 100);

  // Updated to include fiber in the total macro calculation
  const totalMacros = data.protein + data.carbs + data.fats + data.fiber;

  // Calculate the percentages for the donut chart
  const proteinPercent = Math.round((data.protein / totalMacros) * 100);
  const carbsPercent = Math.round((data.carbs / totalMacros) * 100);
  const fatsPercent = Math.round((data.fats / totalMacros) * 100);
  const fiberPercent = Math.round((data.fiber / totalMacros) * 100);

  // Helper function to create the line graph
  const renderLineGraph = () => {
    const width = 600;
    const height = 250;
    const padding = 40;
    const maxValue = 2500; // Max Y-axis value for scaling
    const days = data.dailyProgress.map(d => d.day);
    const calories = data.dailyProgress.map(d => d.calories);
    const burns = data.dailyProgress.map(d => d.burn);

    const xScale = (index: number) => padding + (index / (days.length - 1)) * (width - 2 * padding);
    const yScale = (value: number) => height - padding - (value / maxValue) * (height - 2 * padding);

    const generatePath = (values: number[]) => {
      return values.map((value, index) => {
        const x = xScale(index);
        const y = yScale(value);
        return `${index === 0 ? 'M' : 'L'}${x},${y}`;
      }).join(' ');
    };

    const caloriesPath = generatePath(calories);
    const burnsPath = generatePath(burns);

    return (
      <svg width="100%" height="250" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        {/* Y-axis grid lines and labels */}
        {[0, 500, 1000, 1500, 2000, 2500].map(value => (
          <g key={`y-axis-${value}`}>
            <line
              x1={padding}
              y1={yScale(value)}
              x2={width - padding}
              y2={yScale(value)}
              stroke="#2d3748"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <text x={padding - 10} y={yScale(value) + 4} textAnchor="end" className="text-xs text-gray-400 font-sans" fill="#9ca3af">
              {value}
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {days.map((day, index) => (
          <text
            key={`x-axis-${day}`}
            x={xScale(index)}
            y={height - padding + 20}
            textAnchor="middle"
            className="text-xs text-gray-400 font-sans"
            fill="#9ca3af"
          >
            {day}
          </text>
        ))}

        {/* Calorie Consumed line */}
        <path d={caloriesPath} fill="none" stroke="#ff69b4" strokeWidth="2" />

        {/* Calories Burned line */}
        <path d={burnsPath} fill="none" stroke="#8b5cf6" strokeWidth="2" />

        {/* Data points and hover interaction */}
        {data.dailyProgress.map((item, index) => (
          <g key={`points-${index}`}>
            {/* Calories Consumed point */}
            <circle
              cx={xScale(index)}
              cy={yScale(item.calories)}
              r="4"
              fill="#ff69b4"
              className="group cursor-pointer transition-all duration-200 hover:scale-125"
            />
            <rect
              x={xScale(index) - 20}
              y={yScale(item.calories) - 60}
              width="40"
              height="50"
              fill="transparent"
              className="tooltip-container"
            />
            {/* Tooltip for hover */}
            <g className="tooltip absolute opacity-0 transition-opacity pointer-events-none group-hover:opacity-100">
              <rect
                x={xScale(index) - 30}
                y={yScale(item.calories) - 50}
                width="60"
                height="40"
                rx="8"
                fill="#2d3748"
                className="shadow-lg"
              />
              <text x={xScale(index)} y={yScale(item.calories) - 35} textAnchor="middle" className="text-xs font-semibold" fill="#f7fafc">
                {item.calories} cal
              </text>
              <text x={xScale(index)} y={yScale(item.calories) - 20} textAnchor="middle" className="text-xs" fill="#a0aec0">
                Consumed
              </text>
            </g>


            {/* Calories Burned point */}
            <circle
              cx={xScale(index)}
              cy={yScale(item.burn)}
              r="4"
              fill="#8b5cf6"
              className="group cursor-pointer transition-all duration-200 hover:scale-125"
            />
            {/* Tooltip for hover */}
            <g className="tooltip absolute opacity-0 transition-opacity pointer-events-none group-hover:opacity-100">
              <rect
                x={xScale(index) - 30}
                y={yScale(item.burn) - 50}
                width="60"
                height="40"
                rx="8"
                fill="#2d3748"
                className="shadow-lg"
              />
              <text x={xScale(index)} y={yScale(item.burn) - 35} textAnchor="middle" className="text-xs font-semibold" fill="#f7fafc">
                {item.burn} cal
              </text>
              <text x={xScale(index)} y={yScale(item.burn) - 20} textAnchor="middle" className="text-xs" fill="#a0aec0">
                Burned
              </text>
            </g>
          </g>
        ))}
      </svg>
    );
  };

  return (
    <div className="bg-[#121620] text-gray-200 min-h-screen font-sans antialiased">
      {/* CSS for the fancy water progress bar and tooltips */}
      <style>{`
        @keyframes flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .fancy-water-progress {
          background: linear-gradient(90deg, #60a5fa, #3b82f6, #60a5fa);
          background-size: 200% 100%;
          animation: flow 4s ease infinite;
        }
        /* New tooltip styles for the line graph */
        .tooltip {
          opacity: 0;
          transition: opacity 0.2s ease-in-out;
        }
        .tooltip-container:hover + .tooltip, .tooltip-container:hover ~ .tooltip {
          opacity: 1;
        }
      `}</style>
      {/* Sidebar - now responsive and collapsible on all screens */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1a1e2a] p-6 shadow-xl transform transition-transform duration-300 ease-in-out rounded-r-3xl
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2">
            <img src="uploaded:logo.png-551dbefa-568e-472b-ba83-5b36657973c5" alt="TRACK FITNESS Logo" className="w-auto h-12" />
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 text-gray-400 hover:text-gray-200 transition-colors"
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="flex-1">
          <ul className="space-y-3">
            <li>
              <a href="#" className="flex items-center gap-3 p-3 bg-[#ff69b4]/30 text-[#ff69b4] rounded-xl font-semibold shadow-md transition-colors hover:bg-[#ff69b4]/40">
                <LayoutDashboard size={20} />
                Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-3 p-3 text-gray-400 rounded-xl font-semibold transition-colors hover:bg-[#ff69b4]/10 hover:text-[#ff69b4]">
                <Utensils size={20} />
                Diet Tracker
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-3 p-3 text-gray-400 rounded-xl font-semibold transition-colors hover:bg-purple-500/10 hover:text-purple-500">
                <Dumbbell size={20} />
                Exercise Log
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-3 p-3 text-gray-400 rounded-xl font-semibold transition-colors hover:bg-[#ff69b4]/10 hover:text-[#ff69b4]">
                <Trophy size={20} />
                Achievements
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-3 p-3 text-gray-400 rounded-xl font-semibold transition-colors hover:bg-[#ff69b4]/10 hover:text-[#ff69b4]">
                <Goal size={20} />
                Goals
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        {/* Sticky Header */}
        <header className="sticky top-0 z-30 bg-[#1a1e2a] px-4 lg:px-8 py-4 shadow-xl flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-1 text-gray-400 hover:text-gray-200 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu size={24} />
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl lg:text-2xl font-bold text-gray-50">Welcome, John Doe 👋</h1>
              <p className="text-xs text-gray-400 mt-1">{getCurrentDate()}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full text-gray-400 hover:text-gray-200 transition-colors hover:bg-gray-700/50">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
              JD
            </div>
          </div>
        </header>

        {/* Main Dashboard Grid with padding to account for the sticky header */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Today's Calories Consumed Card */}
            <div className="bg-[#1a1e2a] p-6 rounded-3xl shadow-lg flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-sm text-gray-400 font-semibold mb-1">Calories Consumed</h3>
                  <p className="text-3xl font-bold text-gray-50">{data.caloriesConsumed}</p>
                </div>
                <div className="p-3 bg-[#ff69b4]/20 text-[#ff69b4] rounded-full">
                  <Zap size={24} />
                </div>
              </div>
              <p className="text-xs text-gray-400">Goal: {data.goalCalories} cal</p>
            </div>

            {/* Today's Calories Burned Summary Card */}
            <div className="bg-[#1a1e2a] p-6 rounded-3xl shadow-lg flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-sm text-gray-400 font-semibold mb-1">Calories Burned</h3>
                  <p className="text-3xl font-bold text-gray-50">{data.caloriesBurned}</p>
                </div>
                <div className="p-3 bg-purple-500/20 text-purple-500 rounded-full">
                  <Dumbbell size={24} />
                </div>
              </div>
              <p className="text-xs text-gray-400">This is today's exercise count</p>
            </div>

            {/* Action Buttons Card */}
            <div className="bg-[#1a1e2a] p-6 rounded-3xl shadow-lg flex flex-col justify-between gap-4">
              <button
                onClick={handleTrackWorkout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-[#1a1e2a]"
              >
                <Dumbbell size={20} />
                Track today's workout
              </button>
              <button
                onClick={handleLogDiet}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white font-semibold rounded-xl transition-all duration-300 hover:from-pink-600 hover:to-fuchsia-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-[#1a1e2a]"
              >
                <Utensils size={20} />
                Log today's diet
              </button>
            </div>

            {/* Water Intake Card (Now a separate, small card) */}
            <div className="bg-[#1a1e2a] p-6 rounded-3xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Droplet size={18} className="text-blue-400" />
                  <h3 className="text-sm text-gray-400 font-semibold">Water Intake</h3>
                </div>
                {waterGoalReached && (
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle size={16} />
                    <span className="text-xs font-semibold">Goal Met!</span>
                  </div>
                )}
              </div>
              <div>
                <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
                  <span>Daily Progress</span>
                  <span>{waterIntake.toFixed(2)} / {data.goalWater} L</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-2.5 rounded-full fancy-water-progress transition-all duration-500"
                    style={{ width: `${waterPercentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={handleLogWater}
                  className="w-full px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl shadow-md hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
                >
                  Add 250ml
                </button>
              </div>
            </div>


            {/* Daily Calorie Chart - Now a line graph */}
            <div className="md:col-span-2 lg:col-span-2 xl:col-span-2 bg-[#1a1e2a] p-6 rounded-3xl shadow-lg">
              <h3 className="text-sm text-gray-400 font-semibold mb-4">Weekly Calories</h3>
              {renderLineGraph()}
              <div className="flex items-center justify-center gap-4 mt-6 text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#ff69b4]"></span>
                  Calories Consumed
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                  Calories Burned
                </span>
              </div>
            </div>

            {/* Macronutrient Breakdown Chart */}
            <div className="bg-[#1a1e2a] p-6 rounded-3xl shadow-lg flex flex-col justify-between">
              <div>
                <h3 className="text-sm text-gray-400 font-semibold mb-4">Macronutrient Breakdown</h3>
                <div className="relative w-full aspect-square max-w-40 mx-auto">
                  {/* This is a CSS-based donut chart mockup */}
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `conic-gradient(
                        ${getNutrientColor('Protein')} 0% ${proteinPercent}%,
                        ${getNutrientColor('Carbs')} ${proteinPercent}% ${proteinPercent + carbsPercent}%,
                        ${getNutrientColor('Fats')} ${proteinPercent + carbsPercent}% ${proteinPercent + carbsPercent + fatsPercent}%,
                        ${getNutrientColor('Fiber')} ${proteinPercent + carbsPercent + fatsPercent}% 100%
                      )`,
                    }}
                  ></div>
                  <div className="absolute inset-4 bg-[#1a1e2a] rounded-full flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-50">Macros</p>
                      <p className="text-xs text-gray-400">Today</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-2 w-full">
                  {data.nutrients.map((item, index) => {
                    const goal = data.goalMacros[item.name.toLowerCase() as keyof typeof data.goalMacros] || 1; // Use 1 as a fallback to avoid division by zero
                    return (
                      <div key={index}>
                        <div className="flex justify-between items-center text-sm text-gray-400 mb-1">
                          <span className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }}></span>
                            {item.name}
                          </span>
                          <span className="font-semibold text-gray-50">{item.value}g ({Math.round((item.value / totalMacros) * 100)}%)</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div
                            className="h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (item.value / goal) * 100)}%`, backgroundColor: item.color }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Micronutrient Breakdown Card */}
            <div className="bg-[#1a1e2a] p-6 rounded-3xl shadow-lg flex flex-col justify-between">
              <div>
                <h3 className="text-sm text-gray-400 font-semibold mb-4">Micronutrient Breakdown</h3>
                <div className="space-y-4">
                  {data.micronutrients.map((item, index) => {
                    // Conditional styling for healthy vs. unhealthy progress bars
                    const progressPercentage = Math.min(100, (item.value / item.goal) * 100);
                    const progressBarColor = item.isUnhealthy
                      ? 'bg-gradient-to-r from-red-400 to-rose-500' // Red gradient for unhealthy
                      : 'bg-gradient-to-r from-teal-400 to-cyan-500'; // Green/blue gradient for healthy
                    return (
                      <div key={index}>
                        <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
                          <span>{item.name}</span>
                          <span>{item.value} / {item.goal} {item.unit}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div
                            className={`${progressBarColor} h-2.5 rounded-full transition-all duration-500`}
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-[#1a1e2a] p-6 rounded-3xl shadow-lg lg:col-span-2 xl:col-span-2">
              <h3 className="text-sm text-gray-400 font-semibold mb-4">Recent Activity</h3>
              <ul className="space-y-4">
                {data.recentActivity.map((activity, index) => (
                  <li key={index} className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${activity.type === 'Exercise' ? 'bg-purple-500/20 text-purple-500' : 'bg-[#ff69b4]/20 text-[#ff69b4]'}`}>
                      {activity.type === 'Exercise' ? <Dumbbell size={20} /> : <Utensils size={20} />}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-50">{activity.activity}</p>
                      <p className="text-xs text-gray-400">{activity.type === 'Exercise' ? activity.duration : activity.food}</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-50">
                      {activity.calories} cal
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Gemini AI Workout Plan Generator Card */}
            <div className="bg-[#1a1e2a] p-6 rounded-3xl shadow-lg md:col-span-2 lg:col-span-2 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <Footprints className="text-purple-500" size={24} />
                <h3 className="text-xl text-gray-50 font-bold">✨ Workout Plan Generator</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">Tell me your goal and available equipment to get a personalized workout plan.</p>

              <div className="flex flex-col gap-3 mb-4">
                <input
                  type="text"
                  value={workoutGoal}
                  onChange={(e) => setWorkoutGoal(e.target.value)}
                  placeholder="e.g., 'build muscle'"
                  className="bg-[#1a1e2a] text-gray-200 border border-gray-700 rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500 transition-colors"
                  disabled={isGeneratingWorkout}
                />
                <input
                  type="text"
                  value={equipment}
                  onChange={(e) => setEquipment(e.target.value)}
                  placeholder="e.g., 'dumbbells and a mat'"
                  className="bg-[#1a1e2a] text-gray-200 border border-gray-700 rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500 transition-colors"
                  disabled={isGeneratingWorkout}
                />
                <button
                  onClick={generateWorkoutPlan}
                  disabled={isGeneratingWorkout || !workoutGoal.trim() || !equipment.trim()}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-2 px-4 rounded-xl shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#1a1e2a] disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {isGeneratingWorkout ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    'Generate Workout Plan ✨'
                  )}
                </button>
              </div>

              {isGeneratingWorkout && (
                <div className="flex items-center justify-center p-6 text-gray-400">
                  <Loader2 className="animate-spin mr-2" size={20} />
                  <p>Generating workout plan...</p>
                </div>
              )}

              {showWorkoutError && (
                <div className="p-4 bg-red-600/20 text-red-300 rounded-xl shadow-lg">
                  <p className="font-semibold">Error:</p>
                  <p>Could not generate workout plan. Please try again.</p>
                </div>
              )}

              {workoutPlan && (
                <div className="p-4 bg-[#1a1e2a] rounded-xl shadow-lg border border-purple-500/30 mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xl font-bold text-purple-500">{workoutPlan.goal} Plan</h4>
                    <button
                      onClick={generateAndPlayWorkoutTTS}
                      disabled={isSpeaking}
                      className="text-gray-400 hover:text-purple-500 transition-colors disabled:text-gray-700"
                      aria-label="Read workout plan aloud"
                    >
                      {isSpeaking ? (
                        <Mic className="animate-pulse" size={24} />
                      ) : (
                        <Volume2 size={24} />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">Equipment: {workoutPlan.equipment}</p>
                  <ul className="space-y-4">
                    {workoutPlan.exercises.map((exercise, index) => (
                      <li key={index} className="bg-[#1a1e2a] p-3 rounded-lg border border-gray-700 shadow-md">
                        <p className="font-semibold text-gray-50 text-base flex items-center gap-2">
                          <Dumbbell size={16} />{exercise.name}
                        </p>
                        <p className="text-sm text-gray-400 mt-1 ml-6">
                          Sets: {exercise.sets} | Reps: {exercise.reps}
                        </p>
                        <p className="text-xs text-gray-500 mt-2 ml-6">{exercise.instructions}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <audio ref={audioRef} className="hidden"></audio>
            </div>

            {/* Gemini AI Recipe Generator Card */}
            <div className="bg-[#1a1e2a] p-6 rounded-3xl shadow-lg md:col-span-2 lg:col-span-2 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="text-[#FFA500]" size={24} />
                <h3 className="text-xl text-gray-50 font-bold">✨ Recipe Generator</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">Tell me what you're in the mood for, and I'll generate a healthy recipe for you.</p>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={recipePrompt}
                  onChange={(e) => setRecipePrompt(e.target.value)}
                  placeholder="e.g., 'high-protein vegan salad'"
                  className="flex-1 bg-[#1a1e2a] text-gray-200 border border-gray-700 rounded-xl px-4 py-2 focus:outline-none focus:border-[#ff69b4] transition-colors"
                  disabled={isGeneratingRecipe}
                />
                <button
                  onClick={generateRecipe}
                  disabled={isGeneratingRecipe || !recipePrompt.trim()}
                  className="bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white font-semibold py-2 px-4 rounded-xl shadow-lg transition-all duration-300 hover:from-pink-600 hover:to-fuchsia-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-[#1a1e2a] disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {isGeneratingRecipe ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    'Generate Recipe ✨'
                  )}
                </button>
              </div>

              {isGeneratingRecipe && (
                <div className="flex items-center justify-center p-6 text-gray-400">
                  <Loader2 className="animate-spin mr-2" size={20} />
                  <p>Generating recipe...</p>
                </div>
              )}

              {showRecipeError && (
                <div className="p-4 bg-red-600/20 text-red-300 rounded-xl shadow-lg">
                  <p className="font-semibold">Error:</p>
                  <p>Could not generate recipe. Please try again.</p>
                </div>
              )}

              {recipeResult && (
                <div className="p-4 bg-[#1a1e2a] rounded-xl shadow-lg border border-[#ff69b4]/30 mt-4">
                  <h4 className="text-xl font-bold text-[#ff69b4] mb-2">{recipeResult.recipeName}</h4>
                  <div className="mb-4">
                    <p className="font-semibold text-gray-300 flex items-center gap-2"><Book size={16} />Ingredients:</p>
                    <ul className="list-disc list-inside ml-4 text-sm text-gray-400">
                      {recipeResult.ingredients.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-300 flex items-center gap-2"><Utensils size={16} />Instructions:</p>
                    <ol className="list-decimal list-inside ml-4 text-sm text-gray-400">
                      {recipeResult.instructions.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
