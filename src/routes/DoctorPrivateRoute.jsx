import { Navigate, Outlet } from "react-router-dom";

const DoctorPrivateRoute = () => {
    const token = localStorage.getItem("doctorToken");
    return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default DoctorPrivateRoute;