import { useEffect, useState } from "react";
import { Button, Container, Dropdown, Form, Image, Modal, Nav, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { updateDoctorPassword, updateDoctorProfile } from "../services/doctorAPI";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const DoctorNavbar = ({ user, setUser }) => {
    const navigate = useNavigate();
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: ""
    });
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.name || "",
        phone: user?.phone || "",
        specialization: user?.specialization || "",
        experience: user?.experience || ""
    });
    const [profileErrors, setProfileErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState({});

    const validateProfile = () => {
        const errors = {};
        if (!profileData.name) errors.name = "Name is required";
        if (!profileData.phone) errors.phone = "Phone is required";
        else if (!/^[0-9]{10}$/.test(profileData.phone)) errors.phone = "Enter valid 10-digit phone number";
        if (!profileData.specialization) errors.specialization = "Specialization is required";
        if (!profileData.experience) errors.experience = "Experience is required";
        setProfileErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validatePassword = () => {
        const errors = {};
        if (!passwordData.currentPassword) errors.currentPassword = "current password is required";
        if (!passwordData.newPassword) errors.newPassword = "New password is required";
        else if (passwordData.newPassword.length < 6) errors.newPassword = "Password must be at least 6 characters";
        setPasswordErrors(errors);
        return Object.keys(errors).length === 0;
    };

    useEffect(() => {
        if (showPasswordModal) {
            setPasswordData({
                currentPassword: "",
                newPassword: ""
            });
            setPasswordErrors({});
            setShowPassword(false);
            setShowNewPassword(false);
        }

        if (showProfileModal && user) {
            setProfileData({
                name: user?.name || "",
                phone: user?.phone || "",
                specialization: user?.specialization || "",
                experience: user?.experience || ""
            });
            setProfileErrors({});
        }
    }, [showPasswordModal, user, showProfileModal]);

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleProfileChange = async (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (!validatePassword()) return;

        try {
            const data = await updateDoctorPassword(passwordData);
            toast.success(data.message);
            setShowPasswordModal(false);
            setPasswordData({ currentPassword: "", newPassword: "" });

        } catch (err) {
            toast.error("Password change failed");
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        if (!validateProfile()) return;

        try {
            const data = await updateDoctorProfile(profileData);
            toast.success(data.message || "Profile updated successfully");
            setShowProfileModal(false);
            setUser(prev => ({ ...prev, ...profileData }));

        } catch {
            toast.error("Failed to update profile");
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
                localStorage.removeItem("doctorToken");
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
                        onClick={() => navigate("/doctor/dashboard")}
                    >
                        <img
                            src="/images/hospital.png"
                            alt="Logo"
                            width="40"
                            height="40"
                            className="d-inline-block align-top"
                        />
                        Madhuram Hospital (Doctor)
                    </Navbar.Brand>

                    <Nav className="ms-auto align-items-center gap-3">
                        <Dropdown align="end">

                            <Dropdown.Toggle variant="light" className="d-flex align-items-center border-0 bg-transparent">
                                <Image
                                    src="/images/avatar.png"
                                    roundedCircle
                                    width="35"
                                    height="35"
                                    className="me-2"
                                />
                                <span>{user?.name || "Doctor"}</span>
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item className="dropdown-hover" onClick={() => setShowProfileModal(true)}>Edit Profile</Dropdown.Item>
                                <Dropdown.Item className="dropdown-hover" onClick={() => setShowPasswordModal(true)}>Change Password</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item className="dropdown-hover" onClick={handleLogout}>Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav>
                </Container>
            </Navbar>

            <Modal
                show={showProfileModal}
                onHide={() => setShowProfileModal(false)}
                centered
                backdrop={true}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Edit Profile</Modal.Title>
                </Modal.Header>

                <Form onSubmit={handleProfileSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={profileData.name}
                                onChange={handleProfileChange}
                                isInvalid={!!profileErrors.name}
                            />
                            <Form.Control.Feedback type="invalid">{profileErrors.name}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Phone:</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone"
                                value={profileData.phone}
                                onChange={handleProfileChange}
                                isInvalid={!!profileErrors.phone}
                            />
                            <Form.Control.Feedback type="invalid">{profileErrors.phone}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Specialization:</Form.Label>
                            <Form.Control
                                type="text"
                                name="specialization"
                                value={profileData.specialization}
                                onChange={handleProfileChange}
                                isInvalid={!!profileErrors.specialization}
                            />
                            <Form.Control.Feedback type="invalid">{profileErrors.specialization}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Experience (years):</Form.Label>
                            <Form.Control
                                type="number"
                                name="experience"
                                value={profileData.experience}
                                onChange={handleProfileChange}
                                isInvalid={!!profileErrors.experience}
                            />
                            <Form.Control.Feedback type="invalid">{profileErrors.experience}</Form.Control.Feedback>
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowProfileModal(false)}>
                            Cancel
                        </Button>

                        <Button variant="primary" type="submit">
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
                            <Form.Label>current Password:</Form.Label>
                            <div className="position-relative" style={{ minHeight: "58px" }}>
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    isInvalid={!!passwordErrors.currentPassword}
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
                                <Form.Control.Feedback type="invalid">{passwordErrors.currentPassword}</Form.Control.Feedback>
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

export default DoctorNavbar;