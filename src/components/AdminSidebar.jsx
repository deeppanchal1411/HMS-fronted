import { ListGroup } from "react-bootstrap";
import { FaCalendarAlt, FaFileMedical, FaHome, FaUserMd, FaUsers, FaQuestionCircle } from "react-icons/fa";
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

                {/* <ListGroup.Item
                    action
                    active={location.pathname === "/admin/records"}
                    onClick={() => navigate("/admin/records")}
                >
                    <FaFileMedical className="me-2" /> Medical Records
                </ListGroup.Item>

                <ListGroup.Item
                    action
                    active={location.pathname === "/admin/help"}
                    onClick={() => navigate("/admin/help")}
                >
                    <FaQuestionCircle className="me-2" /> Help & Support
                </ListGroup.Item> */}

            </ListGroup>
        </div>
    );
};

export default AdminSidebar;