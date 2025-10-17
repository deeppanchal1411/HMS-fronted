import { Navigate, Outlet } from "react-router-dom";

const AdminPrivateRoute = () => {
    const token = localStorage.getItem("adminToken");
    return token ? <Outlet /> : <Navigate to="/" replace />
};

export default AdminPrivateRoute;