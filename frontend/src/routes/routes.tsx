import { Routes, Route } from "react-router-dom";
import DashboardPage from "../pages/DashboardPage";
import WorkoutPlanGenerationPage from "../pages/WorkoutPlanGenerationPage";
import LogDietPage from "../pages/LogDietPage";
import LogWorkoutPage from "../pages/LogWorkoutPage";
import LoginPage from "../pages/LoginPage";
import ProfilePage from "../pages/ProfilePage";
import SignUpPage from "../pages/SignUpPage";
import OAuthLoginSucces from "../pages/OAuthLoginSuccess";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/workout_plan_generation" element={<WorkoutPlanGenerationPage />} />
            <Route path="log_diet" element={<LogDietPage />} />
            <Route path="log_workout" element={<LogWorkoutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/login/success" element={<OAuthLoginSucces />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/signUp" element={<SignUpPage />} />
            <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
    );
};

export default AppRoutes;