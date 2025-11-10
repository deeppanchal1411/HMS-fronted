import { ListGroup } from "react-bootstrap";
import { FaCalendarAlt, FaFileMedical, FaHome, FaUserMd, FaUsers, FaQuestionCircle, FaEnvelope } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const AdminSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="bg-white border-end vh-100" style={{ width: "280px" }}>
            <ListGroup variant="flush">

                <ListGroup.Item
                    action
                    active={location.pathname === "/admin/dashboard"}
                    onClick={() => navigate("/admin/dashboard")}
                >
                    <FaHome className="me-2" /> Dashboard
                </ListGroup.Item>

                <ListGroup.Item
                    action
                    active={location.pathname === "/admin/doctors"}
                    onClick={() => navigate("/admin/doctors")}
                >
                    <FaUserMd className="me-2" /> Manage Doctors
                </ListGroup.Item>

                <ListGroup.Item
                    action
                    active={location.pathname === "/admin/patients"}
                    onClick={() => navigate("/admin/patients")}
                >
                    <FaUsers className="me-2" /> Manage Patients
                </ListGroup.Item>

                <ListGroup.Item
                    action
                    active={location.pathname === "/admin/appointments"}
                    onClick={() => navigate("/admin/appointments")}
                >
                    <FaCalendarAlt className="me-2" /> Appointments
                </ListGroup.Item>

                <ListGroup.Item
                    action
                    active={location.pathname === "/admin/contacts/public"}
                    onClick={() => navigate("/admin/contacts/public")}
                >
                    <FaEnvelope className="me-2" /> Public Contacts
                </ListGroup.Item>

                <ListGroup.Item
                    action
                    active={location.pathname === "/admin/contacts/patient"}
                    onClick={() => navigate("/admin/contacts/patient")}
                >
                    <FaFileMedical className="me-2" /> Patient Contacts
                </ListGroup.Item>
            </ListGroup>
        </div>
    );
};

export default AdminSidebar;