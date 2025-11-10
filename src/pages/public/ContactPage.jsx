import axios from "axios";
import { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { API_BASE_URL } from "../../utils/api.js";

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Enter a valid email address";
        }
        if (!formData.message.trim()) {
            newErrors.message = "Message is required";
        } else if (formData.message.length < 10) {
            newErrors.message = "Message must be at least 10 characters";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validate();
        setErrors(formErrors);

        if (Object.keys(formErrors).length === 0) {
            try {
                setLoading(true);
                const res = await axios.post(`${API_BASE_URL}/public/contact`, formData);
                toast.success(res.data.message);
                setFormData({ name: "", email: "", message: "" });

            } catch (err) {
                toast.error(err.response?.data?.error || "Something went wrong");

            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Container className="my-5">
            <h2 className="text-center mb-4 fw-bold" style={{ color: "#337dd5" }}>Contact Us</h2>

            <Row className="g-4">
                <Col md={6}>
                    <Card className="shadow-sm p-4 border-0">
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Name:</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    isInvalid={!!errors.name}
                                    placeholder="Enter your name"
                                />
                                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Email:</Form.Label>
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

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Message:</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={6}
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    isInvalid={!!errors.message}
                                    placeholder="Type your message"
                                />
                                <Form.Control.Feedback type="invalid">{errors.message}</Form.Control.Feedback>
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100 fw-bold" disabled={loading}>
                                {loading ? "Sending..." : "Send Message"}
                            </Button>
                        </Form>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="shadow-sm p-4 border-0 mb-4">
                        <h5 className="fw-bold text-primary">
                            <FaMapMarkerAlt className="me-1" /> Address
                        </h5>
                        <p className="text-muted">123 Hospital Road, Ahmedabad, Gujarat</p>

                        <h5 className="fw-bold text-primary">
                            <FaPhoneAlt className="me-1" /> Phone
                        </h5>
                        <p className="text-muted">+91 9510608821</p>

                        <h5 className="fw-bold text-primary">
                            <FaEnvelope className="me-1" /> Email
                        </h5>
                        <p className="text-muted">panchaldeep@gmail.com</p>
                    </Card>

                    <Card className="shadow-sm border-0">
                        <div style={{ width: "100%", minHeight: "200px" }}>
                            <iframe
                                title="Hospital Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.1864606090935!2d71.18090807541091!3d23.016924979177737!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395a2b09f95efab3%3A0x744f0761c19cef09!2sMadhuram%20Hospital!5e0!3m2!1sen!2sin!4v1762765046688!5m2!1sen!2sin"
                                width="100%"
                                height="200"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                            ></iframe>
                        </div>
                    </Card>
                </Col>
            </Row>
            <ToastContainer position="top-center" autoClose={3000} />
        </Container>
    );
};

export default ContactPage;