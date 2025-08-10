import { Dumbbell, Footprints, Loader2, Volume2, Mic } from 'lucide-react';
import type { WorkoutPlan } from '../services/WorkoutPlanGenerator';
import { generateWorkoutPlan } from '../services/WorkoutPlanGenerator';
import { useState, useRef } from 'react';

function WorkoutPlanGenerationPage() {

    const [workoutGoal, setWorkoutGoal] = useState<string>('');
    const [equipment, setEquipment] = useState<string>('');
    const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
    const [isGeneratingWorkout, setIsGeneratingWorkout] = useState<boolean>(false);
    const [showWorkoutError, setShowWorkoutError] = useState<boolean>(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
    const getWorkoutPlan = async () => {
        setIsGeneratingWorkout(true);
        setWorkoutPlan(null);
        setShowWorkoutError(false);
        try {
            const mockWorkout = await generateWorkoutPlan(workoutGoal, equipment);
            setWorkoutPlan(mockWorkout);
        } catch (error) {
            console.error('Error generating workout plan:', error);
            setShowWorkoutError(true);
        } finally {
            setIsGeneratingWorkout(false);
        }
        if (!workoutGoal.trim() || !equipment.trim()) return;
    }
    const generateAndPlayWorkout = async () => {
        if (!workoutPlan) return;
        setIsSpeaking(true);
        const ttsPrompt = `Here is your workout plan: ${workoutPlan.goal} with ${workoutPlan.equipment}. The exercises are: ` +
            workoutPlan.exercises.map(ex => `${ex.name} for ${ex.sets} sets of ${ex.reps} reps. The instructions are: ${ex.instructions}`).join('. ') + '.';
        await new Promise(resolve => setTimeout(resolve, 5000));
        try {
            //TODO: To add TTS API integration here
            console.log('TTS Prompt:', ttsPrompt);
            const utterance = new SpeechSynthesisUtterance(ttsPrompt);
            speechSynthesis.speak(utterance);
        } catch (error) {
            console.error('Error generating or playing TTS:', error);
        } finally {
            setIsSpeaking(false);
        }
    }

    return (
        <div className="bg-[#1a1e2a] p-6 rounded-3xl shadow-lg md:col-span-2 lg:col-span-2 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
                <Footprints className="text-teal-400" size={24} />
                <h3 className="text-xl text-gray-50 font-bold">✨ Workout Plan Generator</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">Tell me your goal and available equipment to get a personalized workout plan.</p>

            <div className="flex flex-col gap-3 mb-4">
                <input
                    type="text"
                    value={workoutGoal}
                    onChange={(e) => setWorkoutGoal(e.target.value)}
                    placeholder="e.g., 'build muscle'"
                    className="bg-[#1a1e2a] text-gray-200 border border-gray-700 rounded-xl px-4 py-2 focus:outline-none focus:border-fuchsia-400 transition-colors"
                    disabled={isGeneratingWorkout}
                />
                <input
                    type="text"
                    value={equipment}
                    onChange={(e) => setEquipment(e.target.value)}
                    placeholder="e.g., 'dumbbells and a mat'"
                    className="bg-[#1a1e2a] text-gray-200 border border-gray-700 rounded-xl px-4 py-2 focus:outline-none focus:border-fuchsia-400 transition-colors"
                    disabled={isGeneratingWorkout}
                />
                <button
                    onClick={getWorkoutPlan}
                    disabled={isGeneratingWorkout || !workoutGoal.trim() || !equipment.trim()}
                    className="bg-[#a30770] text-white font-semibold py-2 px-4 rounded-xl shadow-lg transition-all duration-300 hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-[#1a1e2a] disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
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
                <div className="p-4 bg-[#1a1e2a] rounded-xl shadow-lg border border-teal-500/30 mt-4">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-xl font-bold text-teal-400">{workoutPlan.goal} Plan</h4>
                        <button
                            onClick={generateAndPlayWorkout}
                            disabled={isSpeaking}
                            className="text-gray-400 hover:text-teal-400 transition-colors disabled:text-gray-700"
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
    )
}

export default WorkoutPlanGenerationPage;