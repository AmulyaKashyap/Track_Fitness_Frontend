export interface WorkoutPlan {
    goal: string;
    equipment: string;
    exercises: Exercise[];
}

export interface Exercise {
    name: string;
    sets: string;
    reps: string;
    instructions: string;
}

export const generateWorkoutPlan = async (workoutGoal: any, equipment: any) => {
    // API call to Gemini model for workout plan generation
    // const prompt = `Generate a workout plan for a fitness app. The user's goal is: "${workoutGoal}" and they have access to: "${equipment}". The response MUST be a JSON object with the following schema: { goal: string, equipment: string, exercises: { name: string, sets: string, reps: string, instructions: string }[] }.`;
    // const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    // const payload = { contents: chatHistory, generationConfig: { responseMimeType: "application/json", ... } };
    // const response = await fetch(apiUrl, { method: 'POST', body: JSON.stringify(payload), ... });
    // const result = await response.json();
    // setWorkoutPlan(JSON.parse(result.candidates[0].content.parts[0].text));

    // Mocked API response for demonstration
    // await new Promise(resolve => setTimeout(resolve, 2000));
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
    return mockWorkout;
};
