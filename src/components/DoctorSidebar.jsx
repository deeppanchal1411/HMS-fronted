import { ListGroup } from "react-bootstrap";
import { FaHome } from "react-icons/fa";
import { FaCalendarCheck, FaUserInjured } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";

const DoctorSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="bg-white border-end vh-100" style={{ width: "280px" }}>

            <ListGroup variant="flush">
                <ListGroup.Item
                    action
                    active={location.pathname === "/doctor/dashboard"}
                    onClick={() => navigate("/doctor/dashboard")}
                >
                    <FaHome className="me-2" /> Dashboard
                </ListGroup.Item>

                <ListGroup.Item
                    action
                    active={location.pathname === "/doctor/appointments"}
                    onClick={() => navigate("/doctor/appointments")}
                >
                    <FaCalendarCheck className="me-2" /> Appointments
                </ListGroup.Item>

                <ListGroup.Item
                    action
                    active={location.pathname === "/doctor/patients"}
                    onClick={() => navigate("/doctor/patients")}
                >
                    <FaUserInjured className="me-2" /> Patients
                </ListGroup.Item>
            </ListGroup>
        </div>
    );
};

export default DoctorSidebar;