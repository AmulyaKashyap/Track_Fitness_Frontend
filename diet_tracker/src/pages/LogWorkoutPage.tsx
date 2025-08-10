import React, { useState } from 'react';
import { Dumbbell, HeartPulse, Split, Plus, ArrowLeft } from 'lucide-react';

// Define the types for the workout data and state
type WorkoutType = 'Cardio' | 'Strength' | 'Flexibility' | 'Other' | null;

interface WorkoutData {
    distance: string;
    time: string;
    pace: string;
    exercise: string;
    sets: string;
    reps: string;
    weight: string;
    stretch: string;
    duration: string;
    other: string;
}

interface RecordedWorkout {
    id: number;
    type: WorkoutType;
    data: WorkoutData;
}

// Main App component for the track workout page
const LogWorkoutPage: React.FC = () => {
    // State to store the currently selected workout type, with type annotation
    const [workoutType, setWorkoutType] = useState<WorkoutType>('Cardio');

    // State to store the data for the workout being added, with type annotation
    const [workoutData, setWorkoutData] = useState<WorkoutData>({
        distance: '',
        time: '',
        pace: '',
        exercise: '',
        sets: '',
        reps: '',
        weight: '',
        stretch: '',
        duration: '',
        other: '',
    });

    // State to manage the list of recorded workouts, with type annotation
    const [recordedWorkouts, setRecordedWorkouts] = useState<RecordedWorkout[]>([]);

    // Function to handle the change of workout type, with type annotation for the parameter
    const handleWorkoutTypeChange = (type: WorkoutType) => {
        setWorkoutType(type);
        // Reset workout data when the type changes
        setWorkoutData({
            distance: '',
            time: '',
            pace: '',
            exercise: '',
            sets: '',
            reps: '',
            weight: '',
            stretch: '',
            duration: '',
            other: '',
        });
    };

    // Function to handle input changes in the forms, with type annotation for the event
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setWorkoutData(prevData => ({ ...prevData, [name]: value }));
    };

    // Function to add the workout to the recorded workouts list
    const handleAddWorkout = () => {
        const newWorkout: RecordedWorkout = {
            id: Date.now(),
            type: workoutType,
            data: workoutData
        };
        setRecordedWorkouts(prevWorkouts => [...prevWorkouts, newWorkout]);
        // Reset the form after adding
        setWorkoutType(null);
    };

    // Renders the input form based on the selected workout type
    const renderWorkoutForm = () => {
        switch (workoutType) {
            case 'Cardio':
                return (
                    <div className="space-y-4">
                        <div className="flex flex-col">
                            <label htmlFor="distance" className="text-sm font-medium text-gray-300">Distance (km)</label>
                            <input
                                type="number"
                                name="distance"
                                id="distance"
                                value={workoutData.distance}
                                onChange={handleInputChange}
                                className="mt-1 p-2 border border-[#3a4050] rounded-lg shadow-sm bg-[#2a3040] text-white focus:ring-[#805ad5] focus:border-[#805ad5]"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="time" className="text-sm font-medium text-gray-300">Time (minutes)</label>
                            <input
                                type="number"
                                name="time"
                                id="time"
                                value={workoutData.time}
                                onChange={handleInputChange}
                                className="mt-1 p-2 border border-[#3a4050] rounded-lg shadow-sm bg-[#2a3040] text-white focus:ring-[#805ad5] focus:border-[#805ad5]"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="pace" className="text-sm font-medium text-gray-300">Pace (min/km)</label>
                            <input
                                type="text"
                                name="pace"
                                id="pace"
                                value={workoutData.pace}
                                onChange={handleInputChange}
                                className="mt-1 p-2 border border-[#3a4050] rounded-lg shadow-sm bg-[#2a3040] text-white focus:ring-[#805ad5] focus:border-[#805ad5]"
                            />
                        </div>
                    </div>
                );
            case 'Strength':
                return (
                    <div className="space-y-4">
                        <div className="flex flex-col">
                            <label htmlFor="exercise" className="text-sm font-medium text-gray-300">Exercise</label>
                            <input
                                type="text"
                                name="exercise"
                                id="exercise"
                                value={workoutData.exercise}
                                onChange={handleInputChange}
                                className="mt-1 p-2 border border-[#3a4050] rounded-lg shadow-sm bg-[#2a3040] text-white focus:ring-[#805ad5] focus:border-[#805ad5]"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="sets" className="text-sm font-medium text-gray-300">Sets</label>
                            <input
                                type="number"
                                name="sets"
                                id="sets"
                                value={workoutData.sets}
                                onChange={handleInputChange}
                                className="mt-1 p-2 border border-[#3a4050] rounded-lg shadow-sm bg-[#2a3040] text-white focus:ring-[#805ad5] focus:border-[#805ad5]"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="reps" className="text-sm font-medium text-gray-300">Reps</label>
                            <input
                                type="number"
                                name="reps"
                                id="reps"
                                value={workoutData.reps}
                                onChange={handleInputChange}
                                className="mt-1 p-2 border border-[#3a4050] rounded-lg shadow-sm bg-[#2a3040] text-white focus:ring-[#805ad5] focus:border-[#805ad5]"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="weight" className="text-sm font-medium text-gray-300">Weight (kg)</label>
                            <input
                                type="number"
                                name="weight"
                                id="weight"
                                value={workoutData.weight}
                                onChange={handleInputChange}
                                className="mt-1 p-2 border border-[#3a4050] rounded-lg shadow-sm bg-[#2a3040] text-white focus:ring-[#805ad5] focus:border-[#805ad5]"
                            />
                        </div>
                    </div>
                );
            case 'Flexibility':
                return (
                    <div className="space-y-4">
                        <div className="flex flex-col">
                            <label htmlFor="stretch" className="text-sm font-medium text-gray-300">Stretch Name</label>
                            <input
                                type="text"
                                name="stretch"
                                id="stretch"
                                value={workoutData.stretch}
                                onChange={handleInputChange}
                                className="mt-1 p-2 border border-[#3a4050] rounded-lg shadow-sm bg-[#2a3040] text-white focus:ring-[#805ad5] focus:border-[#805ad5]"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="duration" className="text-sm font-medium text-gray-300">Duration (seconds)</label>
                            <input
                                type="number"
                                name="duration"
                                id="duration"
                                value={workoutData.duration}
                                onChange={handleInputChange}
                                className="mt-1 p-2 border border-[#3a4050] rounded-lg shadow-sm bg-[#2a3040] text-white focus:ring-[#805ad5] focus:border-[#805ad5]"
                            />
                        </div>
                    </div>
                );
            case 'Other':
                return (
                    <div className="space-y-4">
                        <div className="flex flex-col">
                            <label htmlFor="other" className="text-sm font-medium text-gray-300">Details</label>
                            <textarea
                                name="other"
                                id="other"
                                rows={4}
                                value={workoutData.other}
                                onChange={handleInputChange}
                                className="mt-1 p-2 border border-[#3a4050] rounded-lg shadow-sm bg-[#2a3040] text-white focus:ring-[#805ad5] focus:border-[#805ad5]"
                            />
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="p-4 text-center text-gray-400">
                        Select a workout type to get started!
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-[#1a1e2a] p-4 font-['Inter']">

            <div className="flex items-center gap-4 mb-6">
                <a
                    href='/'
                    className="p-2 rounded-full text-gray-400 hover:text-gray-200 transition-colors hover:bg-gray-700/50"
                    aria-label="Back to dashboard"
                >
                    <ArrowLeft size={24} />
                </a>
                <h2 className="text-2xl font-bold text-gray-50 flex items-center gap-2">
                    <Dumbbell size={24} /> Track your Workout
                </h2>
            </div>
            <div className=" rounded-2xl shadow-xl lg:px-16 p-4 space-y-4">
                {/* Workout Type Selection Section */}
                <section className="bg-[#3a4050] p-6 rounded-xl shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-200 mb-4">1. Select Workout Type</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button
                            onClick={() => handleWorkoutTypeChange('Cardio')}
                            className={`flex-1 min-w-[120px] flex flex-col items-center p-4 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105 ${workoutType === 'Cardio' ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg' : 'bg-[#3a4050] text-rose-400 hover:bg-[#4a5060]'
                                }`}
                        >
                            <HeartPulse size={32} />
                            <span className="mt-2 font-medium">Cardio</span>
                        </button>
                        <button
                            onClick={() => handleWorkoutTypeChange('Strength')}
                            className={`flex-1 min-w-[120px] flex flex-col items-center p-4 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105 ${workoutType === 'Strength' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg' : 'bg-[#3a4050] text-yellow-400 hover:bg-[#4a5060]'
                                }`}
                        >
                            <Dumbbell size={32} />
                            <span className="mt-2 font-medium">Strength</span>
                        </button>
                        <button
                            onClick={() => handleWorkoutTypeChange('Flexibility')}
                            className={`flex-1 min-w-[120px] flex flex-col items-center p-4 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105 ${workoutType === 'Flexibility' ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg' : 'bg-[#3a4050] text-emerald-400 hover:bg-[#4a5060]'
                                }`}
                        >
                            <Split size={32} />
                            <span className="mt-2 font-medium">Flexibility</span>
                        </button>
                        <button
                            onClick={() => handleWorkoutTypeChange('Other')}
                            className={`flex-1 min-w-[120px] flex flex-col items-center p-4 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105 ${workoutType === 'Other' ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg' : 'bg-[#3a4050] text-sky-400 hover:bg-[#4a5060]'
                                }`}
                        >
                            <Plus size={32} />
                            <span className="mt-2 font-medium">Other</span>
                        </button>
                    </div>
                </section>

                {/* Workout Details and Submission Section */}
                <section className="bg-[#2a3040] p-6 rounded-xl shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-200 mb-4">2. Add Workout Details</h2>
                    {renderWorkoutForm()}
                    <button
                        onClick={handleAddWorkout}
                        disabled={!workoutType}
                        className={`mt-6 w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 transform ${!workoutType ? 'bg-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg'
                            }`}
                    >
                        Add Workout
                    </button>
                </section>

                {/* Recorded Workouts Display Section */}
                <section className="bg-[#3a4050] p-6 rounded-xl shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-200 mb-4">Recorded Workouts</h2>
                    {recordedWorkouts.length > 0 ? (
                        <ul className="space-y-4">
                            {recordedWorkouts.map(workout => (
                                <li key={workout.id} className="bg-[#2a3040] p-4 rounded-lg shadow-sm border border-[#3a4050]">
                                    <h3 className="text-lg font-bold text-indigo-400">{workout.type}</h3>
                                    <div className="mt-2 text-sm text-gray-300 space-y-1">
                                        {Object.entries(workout.data).map(([key, value]) => (
                                            value && (
                                                <p key={key}>
                                                    <span className="font-medium capitalize">{key}:</span> {value}
                                                </p>
                                            )
                                        ))}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-4 text-center text-gray-400">
                            No workouts recorded yet.
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default LogWorkoutPage;
