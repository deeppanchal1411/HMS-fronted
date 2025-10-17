import { useState } from "react";
import { Alert, Button, Card, Col, Container, Row, Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../utils/api.js";

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
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={5}>
                    <Card className="p-4 shadow-sm rounded-4">
                        <h3 className="text-center mb-4 fw-bold">{userType} Login</h3>

                        {loggedIn && <Alert variant="success">Logged in successfully!</Alert>}

                        <Form onSubmit={handleSubmit} noValidate>
                            <Form.Group className="mb-3">
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

                            <Form.Group className="mb-3">
                                <Form.Label>Password:</Form.Label>
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
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => setShowPassword(!showPassword)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") setShowPassword(!showPassword);
                                        }}
                                        className="position-absolute"
                                        style={{
                                            cursor: "pointer",
                                            top: "30%",
                                            right: "12px",
                                            transform: "translateY(-50%)",
                                        }}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                    <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                                </div>
                            </Form.Group>

                            <Button type="submit" className="w-100" variant="primary" disabled={loading}>
                                {loading ? "Logging in..." : "Login"}
                            </Button>
                        </Form>
                    </Card>
                </Col>
            </Row>
            <ToastContainer position="top-center" autoClose={3000} />
        </Container>
    );
};

export default LoginForm;