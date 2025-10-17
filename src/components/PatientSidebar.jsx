import { ListGroup } from "react-bootstrap";
import { FaCalendarAlt, FaFileMedical, FaHome, FaPlus, FaQuestionCircle } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom"

const PatientSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    return (
        <div className="bg-white border-end vh-100" style={{ width: "280px" }}>
            <ListGroup variant="flush">

                <ListGroup.Item
                    action 
                    active={location.pathname === "/patient/dashboard"}
                    onClick={() => navigate("/patient/dashboard")}
                >
                    <FaHome className="me-2" /> Dashboard
                </ListGroup.Item>

                <ListGroup.Item 
                    action 
                    active={location.pathname === "/patient/appointments"}
                    onClick={() => navigate("/patient/appointments")}
                >
                    <FaCalendarAlt className="me-2" /> Appointments
                </ListGroup.Item>

                <ListGroup.Item 
                    action 
                    active={location.pathname === "/patient/records"}
                    onClick={() => navigate("/patient/records")}
                >
                    <FaFileMedical className="me-2" /> Medical Records
                </ListGroup.Item>

                <ListGroup.Item 
                    action 
                    active={location.pathname === "/patient/book-appointment"}
                    onClick={() => navigate("/patient/book-appointment")}
                >
                    <FaPlus className="me-2" /> Book New Appointment
                </ListGroup.Item>

                <ListGroup.Item 
                    action 
                    active={location.pathname === "/patient/help"}
                    onClick={() => navigate("/patient/help")}
                >
                    <FaQuestionCircle className="me-2" /> Help & Support
                </ListGroup.Item>

            </ListGroup>
        </div>
    );
};

export default PatientSidebar;