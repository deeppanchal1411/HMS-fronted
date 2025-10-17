import { useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../utils/api.js";

const PatientRegister = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        dob: "",
        gender: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: "" }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.dob) newErrors.dob = 'Date of birth is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Enter a valid 10-digit phone number';
        if (!formData.password || formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Password does not match';

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validate();
        setErrors(formErrors);

        if (Object.keys(formErrors).length === 0) {
            setLoading(true);
            try {
                const res = await axios.post(`${API_BASE_URL}/patients/register`, formData);
                toast.success("Registration successful");
                setSubmitted(true);
                navigate('/patient/login');

            } catch (err) {
                if (err.response && err.response.status === 400) {
                    toast.error(err.response.data.error || "Phone number already registered");
                } else {
                    toast.error("Something went wrong. Please try again.");
                }

            } finally {
                setLoading(false);
            }

        } else {
            setSubmitted(false);
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card className="p-4 shadow-sm rounded-4">
                        <h3 className="text-center mb-4 fw-bold">Patient Registration</h3>

                        {submitted && <Alert variant="success">Form submitted successfully!</Alert>}

                        <Form onSubmit={handleSubmit}>

                            <Form.Group className="mb-3" controlId="formName">
                                <Form.Label>Full Name:</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    isInvalid={!!errors.name}
                                    placeholder="Enter full name"
                                />
                                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formEmail">
                                <Form.Label>Email:</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    isInvalid={!!errors.email}
                                    placeholder="Enter your email"
                                />
                                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formDob">
                                <Form.Label>Date of Birth:</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    isInvalid={!!errors.dob}
                                />
                                <Form.Control.Feedback type="invalid">{errors.dob}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formGender">
                                <Form.Label>Gender:</Form.Label>
                                <Form.Select name="gender" value={formData.gender} onChange={handleChange} isInvalid={!!errors.gender}>
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">{errors.gender}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formPhone">
                                <Form.Label>Phone Number:</Form.Label>
                                <Form.Control
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    isInvalid={!!errors.phone}
                                    placeholder="Enter phone number"
                                />
                                <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formPassword">
                                <Form.Label>password:</Form.Label>
                                <div className="position-relative" style={{ minHeight: "58px" }}>
                                    <Form.Control
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        isInvalid={!!errors.password}
                                        placeholder="Enter password"
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
                                    <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                                </div>
                            </Form.Group>

                            <Form.Group controlId="formConfirmPassword">
                                <Form.Label>Confirm Password:</Form.Label>
                                <div className="position-relative" style={{ minHeight: "58px" }}>
                                    <Form.Control
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        isInvalid={!!errors.confirmPassword}
                                        placeholder="Confirm password"
                                    />
                                    <span
                                        className="position-absolute"
                                        style={{
                                            cursor: "pointer",
                                            top: "30%",
                                            right: "12px",
                                            transform: "translateY(-50%)"
                                        }}
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                    <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                                </div>
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                                {loading ? "Registering..." : "Register"}
                            </Button>
                        </Form>

                        <div className="text-center mt-3">
                            Already have an account? <Link to="/patient/login">Login</Link>
                        </div>

                    </Card>
                </Col>
            </Row>
            
            <ToastContainer position="top-center" autoClose={3000} />
        </Container>
    );
};

export default PatientRegister;