import { useState, useEffect } from 'react';
import {
    Utensils,
    Zap,
    Dumbbell,
    Droplet,
    CheckCircle,
} from 'lucide-react';
import WorkoutPlanGenerationPage from './WorkoutPlanGenerationPage';
import api from '../services/api';
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

interface Activity {
    activity: string;
    type: 'Exercise' | 'Diet';
    duration?: string;
    food?: string;
    calories: number;
}


interface Micronutrient {
    name: string;
    value: number; // e.g., in mg or mcg
    goal: number;
    unit: string;
    isUnhealthy?: boolean; // Flag to indicate if the nutrient is "unhealthy"
}


const getNutrientColor = (name: string): string => {
    return data.nutrients.find(n => n.name === name)?.color || '#e2e8f0';
};

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
        { day: 'Mon', calories: 1800, burn: 400 },
        { day: 'Tue', calories: 2200, burn: 500 },
        { day: 'Wed', calories: 2000, burn: 450 },
        { day: 'Thu', calories: 2100, burn: 550 },
        { day: 'Fri', calories: 2300, burn: 600 },
        { day: 'Sat', calories: 2150, burn: 580 },
        { day: 'Sun', calories: 1900, burn: 420 },
    ] as DailyProgress[],
    nutrients: [
        { name: 'Protein', value: 120, color: '#ff69b4' },
        { name: 'Carbs', value: 250, color: '#FFA500' },
        { name: 'Fats', value: 60, color: '#8b5cf6' },
        { name: 'Fiber', value: 30, color: '#06b6d4' }, // Added fiber to the nutrients array
    ] as Nutrient[],
    // Updated micronutrient list with "unhealthy" items
    micronutrients: [
        { name: 'Vitamin C', value: 90, goal: 100, unit: 'mg' },
        { name: 'Iron', value: 15, goal: 18, unit: 'mg' },
        { name: 'Calcium', value: 950, goal: 1000, unit: 'mg' },
        { name: 'Potassium', value: 3500, goal: 4700, unit: 'mg' },
        { name: 'Sugar', value: 22, goal: 25, unit: 'g', isUnhealthy: true }, // Added sugar
        { name: 'Saturated Fat', value: 18, goal: 20, unit: 'g', isUnhealthy: true }, // Added saturated fat
    ] as Micronutrient[],
    recentActivity: [
        { activity: 'Morning Run', type: 'Exercise', duration: '30 min', calories: 350 },
        { activity: 'Lunch', type: 'Diet', food: 'Chicken Salad', calories: 450 },
        { activity: 'Weightlifting', type: 'Exercise', duration: '45 min', calories: 200 },
        { activity: 'Breakfast', type: 'Diet', food: 'Oatmeal', calories: 300 },
    ] as Activity[],
};

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

function DashboardPage() {

    const [waterIntake, setWaterIntake] = useState<number>(data.initialWaterIntake);
    const [waterGoalReached, setWaterGoalReached] = useState<boolean>(false);

    const totalMacros = data.protein + data.carbs + data.fats + data.fiber;
    const proteinPercent = Math.round((data.protein / totalMacros) * 100);
    const carbsPercent = Math.round((data.carbs / totalMacros) * 100);
    const fatsPercent = Math.round((data.fats / totalMacros) * 100);
    // const fiberPercent = Math.round((data.fiber / totalMacros) * 100);
    // const waterPercentage = Math.min(100, (waterIntake / data.goalWater) * 100);

    useEffect(() => {
        if (waterIntake >= data.goalWater) {
            setWaterGoalReached(true);
        } else {
            setWaterGoalReached(false);
        }
    }, [waterIntake, data.goalWater]);

    const handleLogWater = async () => {
        setWaterIntake(prev => prev + 0.25); // Add 250ml
        const response = await api.get<string>("/test");
        console.log(response);
    };

    return (
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

                {/* Water Intake Card */}
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
                                style={{ width: `${Math.min(100, (waterIntake / data.goalWater) * 100)}%` }}
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

                {/* Action Buttons Card */}
                <div className="bg-[#1a1e2a] p-6 rounded-3xl shadow-lg flex flex-col justify-start gap-4">
                    <a
                        href='/log_workout'
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#ffb200] to-[oklch(0.63_0.28_27.58)]  hover:from-[oklch(0.63_0.28_27.58)] 
  hover:to-[#ffb200] text-white font-semibold rounded-xl transition-all duration-300  focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-[#1a1e2a]"
                    >
                        <Dumbbell size={20} />
                        Track today's workout
                    </a>
                    <a
                        href='/log_diet'
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white font-semibold rounded-xl transition-all duration-300 hover:from-pink-600 hover:to-fuchsia-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-[#1a1e2a]"
                    >
                        <Utensils size={20} />
                        Log today's diet
                    </a>
                </div>

                {/* Daily Calorie Chart */}
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
                <WorkoutPlanGenerationPage />
            </div>
        </main>
    );

}

export default DashboardPage;