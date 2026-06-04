import { Navigate } from "react-router-dom";
import Layout from "./Layout.jsx";

function ProtectRoute({ children, allowedRoles }){
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role')
    if (!token) {
        return <Navigate to='/login'/>
    } if (allowedRoles && !allowedRoles.includes(role)){
        if (role === 'Operator'){
            return <Navigate to='/assistant'/>
        } else if (role === 'Executive Viewer' || role === 'Supervisor' || role === 'Administrator'){
            return <Navigate to='/dashboard'/>
        }
        return <Navigate to='/login'/>;
    }
    return <Layout>{children}</Layout>;

}

export default ProtectRoute;