import { Navigate, Outlet } from "react-router-dom";

const PatientPrivateRoute  = () => {
    const token = localStorage.getItem("patientToken");
    return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default PatientPrivateRoute;