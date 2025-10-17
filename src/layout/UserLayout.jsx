import { useEffect, useState } from "react";
import { getPatientProfile } from "../services/patientAPI";
import { getDoctorProfile } from "../services/doctorAPI";
import { getAdminProfile } from "../services/adminAPI";
import { Container, Spinner } from "react-bootstrap";
import PatientNavbar from "../components/PatientNavbar";
import DoctorNavbar from "../components/DoctorNavbar";
import AdminNavbar from "../components/AdminNavbar";
import PatientSidebar from "../components/PatientSidebar";
import DoctorSidebar from "../components/DoctorSidebar";
import AdminSidebar from "../components/AdminSidebar";
import { Outlet } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

const UserLayout = ({ userType }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProfile = async () => {
        try {
            let data;
            if (userType === "patient") {
                data = await getPatientProfile();
                setUser(data);

            } else if (userType === "doctor") {
                data = await getDoctorProfile();
                setUser(data.doctor || data);

            } else if (userType === "admin") {
                data = await getAdminProfile();
                setUser(data);

            } else {
                throw new Error("Invalid user type");
            }

        } catch (err) {
            console.error(`Failed to load ${userType} profile:`, err);
            setError("Failed to load your profile. Please try again later.");

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <Container>
                <LoadingSpinner message={`Loading ${userType} profile...`} fullscreen />
            </Container>
        );
    };

    if (error) {
        return (
            <Container className="text-center mt-5">
                <p className="text-danger">{error}</p>
            </Container>
        );
    };

    const NavbarComponent =
        userType === "patient"
            ? PatientNavbar
            : userType === "doctor"
                ? DoctorNavbar
                : AdminNavbar;

    const SidebarComponent =
        userType === "patient"
            ? PatientSidebar
            : userType === "doctor"
                ? DoctorSidebar
                : AdminSidebar;

    return (
        <>
            <NavbarComponent user={user} setUser={setUser} />
            <div className="d-flex">
                <SidebarComponent />
                <div className="flex-grow-1">
                    <Outlet context={{ user }} />
                </div>
            </div>
        </>
    );
};

export default UserLayout; 