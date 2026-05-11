import { ReactNode } from "react";
import { Navigate } from "react-router-dom"
interface PrivateRoutePage {
    children: ReactNode
}

function isJwtExpired(token: string) {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return true;
        const payload = JSON.parse(atob(parts[1]));
        if (!payload?.exp) return false;
        const nowInSeconds = Math.floor(Date.now() / 1000);
        return payload.exp <= nowInSeconds;
    } catch {
        return true;
    }
}

const PrivateRoutes = ({children} : PrivateRoutePage) => {

    const token = localStorage.getItem('token');
    const isAutenticated = Boolean(token) && !isJwtExpired(token as string);

    if (!isAutenticated) {
        localStorage.removeItem('token');
        return <Navigate to="/Login" />;
    }
    return children


  
}

export default PrivateRoutes;
