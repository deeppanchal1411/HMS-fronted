import axios from "axios";
import { useEffect, useState } from "react";
import { Navbar, Container, Nav, Dropdown, Image, Modal, Form, Button } from "react-bootstrap";
import { FaBell, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";

const PatientNavbar = ({ user, setUser }) => {
    const navigate = useNavigate();
    const [showEditModal, setShowEditModal] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        gender: "",
        dob: ""
    });
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [editErrors, setEditErrors] = useState({});
    const [passwordErrors, setPasswordErrors] = useState({});

    const validateEdit = () => {
        const errors = {};
        if (!formData.name.trim()) errors.name = "Name is required";
        if (!formData.email) errors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Invalid email";
        if (!formData.phone) errors.phone = "Phone is required";
        else if (!/^\d{10,}$/.test(formData.phone)) errors.phone = "Invalid phone number";
        if (!formData.gender) errors.gender = "Select gender";
        if (!formData.dob) errors.dob = "Date of birth is required";
        setEditErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validatePassword = () => {
        const errors = {};
        if (!passwordData.oldPassword) errors.oldPassword = "Old password is required";
        if (!passwordData.newPassword) errors.newPassword = "New password is required";
        else if (passwordData.newPassword.length < 6) errors.newPassword = "Password must be at least 6 characters";
        setPasswordErrors(errors);
        return Object.keys(errors).length === 0;
    };  

    useEffect(() => {
        if (showEditModal && user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                gender: user.gender || "",
                dob: user.dob ? user.dob.split("T")[0] : ""
            });
            setEditErrors({});
        }

        if (showPasswordModal) {
            setPasswordData({
                oldPassword: "",
                newPassword: ""
            });
            setPasswordErrors({});
            setShowPassword(false);
            setShowNewPassword(false);
        }
    }, [showEditModal, user, showPasswordModal]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateEdit()) return;

        try {
            const token = localStorage.getItem("patientToken");
            const { data } = await axios.put("http://localhost:5000/api/patients/edit-profile", formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(data.message);
            setShowEditModal(false);
            setUser(prev => ({ ...prev, ...formData }));

        } catch (err) {
            toast.error("Profile update failed");
        }
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (!validatePassword()) return;

        try {
            const token = localStorage.getItem("patientToken");
            const { data } = await axios.put(
                "http://localhost:5000/api/patients/update-password",
                passwordData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(data.message);
            setShowPasswordModal(false);
            setPasswordData({ oldPassword: "", newPassword: "" });

        } catch (err) {
            toast.error("Password change failed");
        }
    };

    const handleLogout = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out of your account.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, logout",
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("patientToken");
                Swal.fire("Logged out!", "You have been logged out successfully.", "success");
                navigate("/");
            }
        });
    };

    return (
        <>
            <Navbar expand="lg" className="shadow-sm py-2" style={{ backgroundColor: "#338dd7ff" }}>
                <ToastContainer />

                <Container fluid>
                    <Navbar.Brand
                        className="d-flex fs-4 align-items-center gap-2 fw-bold"
                        role="button"
                        onClick={() => navigate("/patient/dashboard")}
                    >
                        <img
                            src="/images/hospital.png"
                            alt="Logo"
                            width="40"
                            height="40"
                            className="d-inline-block align-top"
                        />
                        Madhuram Hospital
                    </Navbar.Brand>

                    <Nav className="ms-auto align-items-center gap-3">
                        <FaBell size={20} role="button" />

                        <Dropdown align="end">
                            <Dropdown.Toggle variant="light" className="d-flex align-items-center border-0 bg-transparent">
                                <Image
                                    src="/images/avatar.png"
                                    roundedCircle
                                    width="35"
                                    height="35"
                                    className="me-2"
                                />
                                <span>{user?.name || "Patient"}</span>
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item className="dropdown-hover" onClick={() => setShowEditModal(true)}>Edit Profile</Dropdown.Item>
                                <Dropdown.Item className="dropdown-hover" onClick={() => setShowPasswordModal(true)}>Change Password</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item className="dropdown-hover" onClick={handleLogout}>Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav>
                </Container>
            </Navbar>

            <Modal
                show={showEditModal}
                onHide={() => setShowEditModal(false)}
                centered
                backdrop={true}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Edit Profile</Modal.Title>
                </Modal.Header>

                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                isInvalid={!!editErrors.name}
                            />
                            <Form.Control.Feedback type="invalid">{editErrors.name}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email:</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                isInvalid={!!editErrors.email}
                            />
                            <Form.Control.Feedback type="invalid">{editErrors.email}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Phone:</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                isInvalid={!!editErrors.phone}
                            />
                            <Form.Control.Feedback type="invalid">{editErrors.phone}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Gender:</Form.Label>
                            <Form.Select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                isInvalid={!!editErrors.gender}
                            >
                                <option value="">Select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">{editErrors.gender}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Date of Birth</Form.Label>
                            <Form.Control
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                isInvalid={!!editErrors.dob}
                            />
                            <Form.Control.Feedback type="invalid">{editErrors.dob}</Form.Control.Feedback>
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" >
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <Modal
                show={showPasswordModal}
                onHide={() => setShowPasswordModal(false)}
                centered
                backdrop={true}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Change Password</Modal.Title>
                </Modal.Header>

                <Form onSubmit={handlePasswordSubmit}>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Old Password:</Form.Label>
                            <div className="position-relative" style={{ minHeight: "58px" }}>
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    name="oldPassword"
                                    value={passwordData.oldPassword}
                                    onChange={handlePasswordChange}
                                    isInvalid={!!passwordErrors.oldPassword}
                                />
                                <span
                                    className="position-absolute"
                                    style={{
                                        cursor: "pointer",
                                        top: "30%",
                                        right: "12px",
                                        transform: "translateY(-50%)"
                                    }}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                                <Form.Control.Feedback type="invalid">{passwordErrors.oldPassword}</Form.Control.Feedback>
                            </div>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>New Password:</Form.Label>
                            <div className="position-relative" style={{ minHeight: "58px" }}>
                                <Form.Control
                                    type={showNewPassword ? "text" : "password"}
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    isInvalid={!!passwordErrors.newPassword}
                                />
                                <span
                                    className="position-absolute"
                                    style={{
                                        cursor: "pointer",
                                        top: "30%",
                                        right: "12px",
                                        transform: "translateY(-50%)"
                                    }}
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                                <Form.Control.Feedback type="invalid">{passwordErrors.newPassword}</Form.Control.Feedback>
                            </div>
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
                            Cancel
                        </Button>
                                    
                        <Button variant="primary" type="submit">
                            Save Password
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
};

export default PatientNavbar;