import { useState } from "react";
import { Alert, Button, Card, Col, Container, Row, Form, InputGroup } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../utils/api.js";
import { FaLock, FaPhone } from "react-icons/fa6";

const LoginForm = ({ userType, apiEndpoint, tokenKey, redirectPath }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ phone: "", password: "" });
    const [errors, setErrors] = useState({});
    const [loggedIn, setLoggedIn] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    };

    const validate = () => {
        const newErrors = {};
        if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Enter a valid 10-digit phone number";
        if (!formData.password) newErrors.password = "Password is required";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validate();
        setErrors(formErrors);

        if (Object.keys(formErrors).length === 0) {
            setLoading(true);
            try {
                const res = await axios.post(`${API_BASE_URL}${apiEndpoint}`, formData);
                toast.success("Login successful");
                setLoggedIn(true);
                localStorage.setItem(tokenKey, res.data.token);
                navigate(redirectPath);

            } catch (err) {
                const status = err.response?.status;
                const message = err.response?.data?.message || err.response?.data?.error;

                if (status === 400) toast.error(message || "User not found");
                else if (status === 401) toast.error(message || "Invalid password");
                else toast.error("Something went wrong. Please try again.");
                console.error(err);

            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #0d6efd, #0dcaf0)",
                display: "flex",
                alignItems: "center",
            }}
        >
            <Container>
                <Row className="justify-content-center">
                    <Col md={5}>
                        <Card className="p-4 shadow-lg rounded-4 border-0">
                            <h2 className="text-center fw-bold mb-3 text-primary">{userType} Login</h2>
                            <p className="text-center text-muted mb-4">Welcome back! Please login to continue.</p>

                            {loggedIn && <Alert variant="success">Logged in successfully!</Alert>}

                            <Form onSubmit={handleSubmit} noValidate>
                                <Form.Group className="mb-3">
                                    <Form.Label>Phone Number :</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text><FaPhone /></InputGroup.Text>
                                        <Form.Control
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            isInvalid={!!errors.phone}
                                            placeholder="Enter phone number"
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Password :</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text><FaLock /></InputGroup.Text>
                                        <Form.Control
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            isInvalid={!!errors.password}
                                            placeholder="Enter password"
                                        />
                                        <Button
                                            variant="outline-secondary"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </Button>
                                        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>

                                <Button
                                    type="submit"
                                    className="w-100 fw-bold"
                                    variant="primary"
                                    disabled={loading}
                                >
                                    {loading ? "Logging in..." : "Login"}
                                </Button>

                                <div className="text-center mt-3">
                                    <span className="text-muted">Don’t have an account? </span>
                                    <a href="#" className="fw-semibold text-primary text-decoration-none">Register</a>
                                </div>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <ToastContainer position="top-center" autoClose={3000} />
        </div>
    );
};

export default LoginForm;