import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const OAuthLoginSucces = () => {
    const location = useLocation();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const token = query.get("token");

        if (token) {
            localStorage.setItem("accessToken", token);
            window.location.href = "/";
        }
    }, [location]);

    return <h2>Logging you in...</h2>;
};

export default OAuthLoginSucces;