import { Route, Routes } from "react-router-dom";
import PatientRegister from "./pages/auth/PatientRegister";
import PatientLogin from "./pages/auth/PatientLogin";
import DoctorLogin from "./pages/auth/DoctorLogin";
import AdminLogin from "./pages/auth/AdminLogin";
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientPrivateRoute from "./routes/PatientPrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import HomePage from "./pages/public/HomePage";
import DoctorsPage from "./pages/public/DoctorsPage";
import ContactPage from "./pages/public/ContactPage";
import PatientAppointments from "./pages/patient/PatientAppointments";
import PatientBookAppointment from "./pages/patient/PatientBookAppointment";
import HelpSupport from "./pages/patient/PatientHelp";
import AdminPrivateRoute from "./routes/AdminPrivateRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageDoctors from "./pages/admin/ManageDoctors";
import ManagePatients from "./pages/admin/ManagePatients";
import Appointments from "./pages/admin/Appointments";
import DoctorPrivateRoute from "./routes/DoctorPrivateRoute";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorPatients from "./pages/doctor/DoctorPatients";
import UserLayout from "./layout/UserLayout";
import DoctorAvailability from "./pages/doctor/DoctorAvailability";

function App() {
    return (
        <Routes>
            <Route path="/" element={<PublicRoute />}>
                <Route index element={<HomePage />} />
                <Route path="doctors" element={<DoctorsPage />} />
                <Route path="contact" element={<ContactPage />} />
            </Route>

            <Route
                path="/patient/register"
                element={<PatientRegister />}
            />
            <Route
                path="/patient/login"
                element={<PatientLogin />}
            />
            <Route
                path="/doctor/login"
                element={<DoctorLogin />}
            />
            <Route
                path="/admin/login"
                element={<AdminLogin />}
            />

            <Route path="/patient" element={<PatientPrivateRoute />}>
                <Route element={<UserLayout userType="patient" />}>
                    <Route path="dashboard" element={<PatientDashboard />} />
                    <Route path="appointments" element={<PatientAppointments />} />
                    <Route path="book-appointment" element={<PatientBookAppointment />} />
                    <Route path="help" element={<HelpSupport />} />
                </Route>
            </Route>

            <Route path="/doctor" element={<DoctorPrivateRoute />}>
                <Route element={<UserLayout userType="doctor" />}>
                    <Route path="dashboard" element={<DoctorDashboard />} />
                    <Route path="appointments" element={<DoctorAppointments />} />
                    <Route path="patients" element={<DoctorPatients />} />
                    <Route path="availability" element={<DoctorAvailability />} />
                </Route> 
            </Route>

            <Route path="/admin" element={<AdminPrivateRoute />}>
                <Route element={<UserLayout userType="admin" />}>
                    <Route path="dashboard" element={<AdminDashboard/>} />
                    <Route path="doctors" element={<ManageDoctors />} />
                    <Route path="patients" element={<ManagePatients />} />
                    <Route path="appointments" element={<Appointments />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default App;