import { ReactNode } from "react";
import { Navigate } from "react-router-dom"
interface PrivateRoutePage {
    children: ReactNode
}
const PrivateRoutes = ({children} : PrivateRoutePage) => {

    const isAutenticated = localStorage.getItem ('token')

    if (!isAutenticated) {
        return <Navigate to="/Login" />;
    }
    return children


  
}

export default PrivateRoutes;