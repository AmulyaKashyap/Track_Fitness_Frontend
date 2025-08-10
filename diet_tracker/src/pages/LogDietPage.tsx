import { Dumbbell, Footprints, Loader2, Volume2, Mic, ArrowLeft, Utensils, TrendingUp, Calendar, Trash2, Coffee, Soup, MoonStar, Sandwich } from 'lucide-react';
import type { WorkoutPlan } from '../services/WorkoutPlanGenerator';
import { generateWorkoutPlan } from '../services/WorkoutPlanGenerator';
import { useState, useRef } from 'react';
import CustomDropdown from '../components/CustomDropDown';

// New function to generate dummy nutritional breakdown based on meal details
const getDummyNutritionalBreakdown = (mealDetails: string) => {
    const lowerCaseDetails = mealDetails.toLowerCase();
    // Simple logic to return different mock data
    if (lowerCaseDetails.includes('dal') && lowerCaseDetails.includes('chaval')) {
        return {
            calories: 550,
            protein: 18,
            carbs: 70,
            fats: 20,
            fiber: 10,
            micronutrients: [
                { name: 'Vitamin A', value: 300, goal: 900, unit: 'µg' },
                { name: 'Vitamin C', value: 20, goal: 100, unit: 'mg' },
                { name: 'Iron', value: 8, goal: 18, unit: 'mg' },
                { name: 'Sodium', value: 1200, goal: 2300, unit: 'mg', isUnhealthy: true },
            ],
        };
    } else if (lowerCaseDetails.includes('chicken') && lowerCaseDetails.includes('salad')) {
        return {
            calories: 450,
            protein: 40,
            carbs: 15,
            fats: 25,
            fiber: 8,
            micronutrients: [
                { name: 'Vitamin C', value: 70, goal: 100, unit: 'mg' },
                { name: 'Vitamin K', value: 60, goal: 120, unit: 'µg' },
                { name: 'Magnesium', value: 150, goal: 420, unit: 'mg' },
                { name: 'Sodium', value: 800, goal: 2300, unit: 'mg', isUnhealthy: true },
            ],
        };
    } else if (lowerCaseDetails.includes('sandwich')) {
        return {
            calories: 380,
            protein: 22,
            carbs: 45,
            fats: 10,
            fiber: 5,
            micronutrients: [
                { name: 'Calcium', value: 200, goal: 1000, unit: 'mg' },
                { name: 'Vitamin B12', value: 1.5, goal: 2.4, unit: 'µg' },
                { name: 'Sodium', value: 750, goal: 2300, unit: 'mg', isUnhealthy: true },
            ],
        };
    } else if (lowerCaseDetails.includes('oatmeal')) {
        return {
            calories: 300,
            protein: 10,
            carbs: 50,
            fats: 8,
            fiber: 7,
            micronutrients: [
                { name: 'Iron', value: 4, goal: 18, unit: 'mg' },
                { name: 'Magnesium', value: 100, goal: 420, unit: 'mg' },
            ],
        };
    } else if (lowerCaseDetails.includes('snack')) {
        return {
            calories: 150,
            protein: 5,
            carbs: 15,
            fats: 8,
            fiber: 2,
            micronutrients: [
                { name: 'Vitamin A', value: 100, goal: 900, unit: 'µg' },
            ],
        };
    } else {
        // Default breakdown for unknown meals
        return {
            calories: 400,
            protein: 15,
            carbs: 50,
            fats: 15,
            fiber: 4,
            micronutrients: [
                { name: 'Vitamin C', value: 30, goal: 100, unit: 'mg' },
                { name: 'Calcium', value: 150, goal: 1000, unit: 'mg' },
            ],
        };
    }
};
interface Micronutrient {
    name: string;
    value: number; // e.g., in mg or mcg
    goal: number;
    unit: string;
    isUnhealthy?: boolean; // Flag to indicate if the nutrient is "unhealthy"
}

interface LoggedMeal {
    id: string;
    mealName: string;
    details: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fiber: number; // Added fiber
    micronutrients: Micronutrient[]; // Added micronutrients
    date: string;
}

function LogDietPage() {

    const [mealForm, setMealForm] = useState({
        mealName: '',
        details: '', // New state for meal details
    });
    // New state for the diet logging page
    const [loggedMeals, setLoggedMeals] = useState<LoggedMeal[]>([]);
    const [lastLoggedMealBreakdown, setLastLoggedMealBreakdown] = useState<LoggedMeal | null>(null);


    // Function to submit a new meal
    const handleAddMeal = (e: React.FormEvent) => {
        e.preventDefault();

        if (!mealForm.mealName || !mealForm.details) {
            // Replaced alert with a simple console log for better UX in a web app
            console.error("Please select a meal name and enter meal details.");
            return;
        }

        // Get dummy nutritional breakdown based on the meal details
        const breakdown = getDummyNutritionalBreakdown(mealForm.details);

        const newMeal: LoggedMeal = {
            id: Date.now().toString(),
            mealName: mealForm.mealName,
            details: mealForm.details, // Use the new meal details
            calories: breakdown.calories,
            protein: breakdown.protein,
            carbs: breakdown.carbs,
            fats: breakdown.fats,
            fiber: breakdown.fiber,
            micronutrients: breakdown.micronutrients as Micronutrient[],
            date: new Date().toISOString().split('T')[0],
        };
        setLoggedMeals(prev => [...prev, newMeal]);
        setLastLoggedMealBreakdown(newMeal); // Set the last logged meal for the new card

        // Reset form after submission
        setMealForm({
            mealName: '',
            details: '',
        });
    };
    const handleMealSelect = (value: string) => {
        setMealForm(prev => ({ ...prev, mealName: value }));
    };

    const handleMealFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setMealForm(prev => ({
            ...prev,
            [name]: value,
        }));
    };
    const getMealIcon = (mealName: string) => {
        switch (mealName) {
            case 'Breakfast': return <Coffee size={20} className="text-[#FFA500]" />;
            case 'Lunch': return <Soup size={20} className="text-pink-500" />;
            case 'Dinner': return <MoonStar size={20} className="text-purple-500" />;
            case 'Mid-snacks': return <Sandwich size={20} className="text-cyan-500" />;
            default: return null;
        }
    };

    const handleDeleteMeal = (mealId: string) => {
        setLoggedMeals(prev => prev.filter(meal => meal.id !== mealId));
        // Clear the last logged meal breakdown if the deleted item was the last one
        if (lastLoggedMealBreakdown?.id === mealId) {
            setLastLoggedMealBreakdown(null);
        }
    };

    return (

        <main className="flex-1 p-4 lg:p-8">
            <div className="flex items-center gap-4 mb-6">
                <a
                    href='/'
                    className="p-2 rounded-full text-gray-400 hover:text-gray-200 transition-colors hover:bg-gray-700/50"
                    aria-label="Back to dashboard"
                >
                    <ArrowLeft size={24} />
                </a>
                <h2 className="text-2xl font-bold text-gray-50 flex items-center gap-2">
                    <Utensils size={24} /> Log Today's Diet
                </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Meal Logging Form */}
                <div className="bg-[#1a1e2a] p-6 rounded-3xl shadow-lg flex flex-col">
                    <h3 className="text-xl font-bold text-gray-50 mb-4">Add a new meal</h3>
                    <form onSubmit={handleAddMeal} className="space-y-4">
                        <CustomDropdown
                            value={mealForm.mealName}
                            onChange={handleMealSelect}
                            placeholder="Select a meal"
                        />
                        <input
                            type="text"
                            name="details"
                            value={mealForm.details}
                            onChange={handleMealFormChange}
                            placeholder="Meal Details (e.g., 'Dal chaval with palak')"
                            className="w-full bg-[#121620] text-gray-200 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:from-pink-600 hover:to-fuchsia-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-[#1a1e2a]"
                        >
                            <Utensils size={20} />
                            Add Meal
                        </button>
                    </form>
                </div>

                {/* Current Meal Breakdown Card */}
                {lastLoggedMealBreakdown && (
                    <div className="bg-[#1a1e2a] p-6 rounded-3xl shadow-lg flex flex-col">
                        <h3 className="text-xl font-bold text-gray-50 mb-4 flex items-center gap-2">
                            <TrendingUp size={20} /> Nutritional Breakdown for <span className="text-pink-500">{lastLoggedMealBreakdown.mealName}</span>
                        </h3>
                        <div className="p-4 rounded-xl border border-pink-500/30 bg-[#121620] mb-10">
                            <p className="font-semibold text-gray-400 mb-2 text-sm">
                                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deserunt dolore iste quae aut cupiditate officiis culpa nisi, hic illum dignissimos quod, error laudantium sapiente. Accusantium libero similique fuga reiciendis iure!
                            </p>
                        </div>
                        <div className="p-4 rounded-xl border border-pink-500/30 bg-[#121620]">
                            <p className="font-semibold text-lg text-gray-50 mb-2">{lastLoggedMealBreakdown.details}</p>

                            {/* Macronutrients Section */}
                            <h4 className="font-semibold text-gray-400 text-sm mb-2 mt-4">Macronutrients</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-gray-400">
                                <p>Calories: <span className="font-bold text-pink-400">{lastLoggedMealBreakdown.calories} kcal</span></p>
                                <p>Protein: <span className="font-bold text-cyan-400">{lastLoggedMealBreakdown.protein}g</span></p>
                                <p>Carbs: <span className="font-bold text-orange-400">{lastLoggedMealBreakdown.carbs}g</span></p>
                                <p>Fats: <span className="font-bold text-purple-400">{lastLoggedMealBreakdown.fats}g</span></p>
                                <p>Fiber: <span className="font-bold text-teal-400">{lastLoggedMealBreakdown.fiber}g</span></p>
                            </div>

                            {/* Micronutrients Section */}
                            <h4 className="font-semibold text-gray-400 text-sm mt-6 mb-2">Micronutrients</h4>
                            <div className="space-y-4 max-h-56 overflow-y-auto pr-2 custom-scrollbar">
                                {lastLoggedMealBreakdown.micronutrients.length > 0 ? (
                                    lastLoggedMealBreakdown.micronutrients.map((item, index) => {
                                        const progressPercentage = Math.min(100, (item.value / item.goal) * 100);
                                        const progressBarColor = item.isUnhealthy
                                            ? 'bg-gradient-to-r from-red-400 to-rose-500'
                                            : 'bg-gradient-to-r from-teal-400 to-cyan-500';
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
                                    })
                                ) : (
                                    <p className="text-center text-gray-500 text-sm">No detailed micronutrient data available.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Logged Meals Display - Now with delete buttons and icons */}
                <div className="bg-[#1a1e2a] p-6 rounded-3xl shadow-lg flex flex-col">
                    <h3 className="text-xl font-bold text-gray-50 mb-4 flex items-center gap-2">
                        <Calendar size={20} /> Today's Logged Meals
                    </h3>
                    {loggedMeals.length > 0 ? (
                        <ul className="space-y-3">
                            {loggedMeals.map(meal => (
                                <li key={meal.id} className="flex items-start gap-4 bg-[#121620] p-4 rounded-xl shadow-md border border-gray-700">
                                    {/* Meal Type Icon */}
                                    <div className={`p-2 rounded-full flex-shrink-0`}>
                                        {getMealIcon(meal.mealName)}
                                    </div>

                                    {/* Meal Details */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <p className="font-semibold text-lg text-gray-50">{meal.mealName}</p>
                                        </div>
                                        <p className="text-sm text-gray-400 mb-2">{meal.details}</p>
                                        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-gray-400">
                                            <p>Calories: <span className="font-bold text-pink-400">{meal.calories} kcal</span></p>
                                            <p>Protein: <span className="font-bold text-cyan-400">{meal.protein}g</span></p>
                                            <p>Carbs: <span className="font-bold text-orange-400">{meal.carbs}g</span></p>
                                            <p>Fats: <span className="font-bold text-purple-400">{meal.fats}g</span></p>
                                        </div>
                                    </div>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleDeleteMeal(meal.id)}
                                        className="p-2 text-gray-400 hover:text-red-400 transition-colors flex-shrink-0"
                                        aria-label={`Delete ${meal.mealName}`}
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500 p-6">
                            <Utensils size={48} className="mb-4" />
                            <p className="text-lg font-semibold">No meals logged yet!</p>
                            <p className="text-sm">Use the form to add your first meal of the day.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

export default LogDietPage;

