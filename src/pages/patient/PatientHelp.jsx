import { useState } from "react";
import { Container, Card, Form, Button, Accordion } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";

const HelpSupport = () => {
    const [formData, setFormData] = useState({
        subject: "",
        message: ""
    });

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success("Your query has been submitted!");
        setFormData({ subject: "", message: "" });
    };

    return (
        <Container className="mt-4">
            <h2 className="text-center mb-3">Help & Support</h2>
            <p className="text-center text-muted mb-4">Need assistance? Browse FAQs or contact our support team.</p>

            <Accordion defaultActiveKey="0" className="mb-4 shadow-sm rounded">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>How do I book an appointment?</Accordion.Header>
                    <Accordion.Body>
                        You can book an appointment by navigating to the "Book Appointment" section from the sidebar and filling in the required details.
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>How do I reset my password?</Accordion.Header>
                    <Accordion.Body>
                        Go to "Change Password" from the user menu in the navbar and follow the instructions to reset your password securely.
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                    <Accordion.Header>Who do I contact for medical emergencies?</Accordion.Header>
                    <Accordion.Body>
                        Please call our emergency hotline: <strong>+91 9876543210</strong> or email support at <strong>support@madhuramhospital.com</strong>.
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>

            <Card className="p-3 shadow-sm rounded-4">
                <h4 className="mb-3 text-primary">Contact Support</h4>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Subject:</Form.Label>
                        <Form.Control
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Enter subject"
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Message:</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Describe your issue or question"
                            required
                        />
                    </Form.Group>
                    <div className="text-center">
                        <Button variant="primary" type="submit" className="px-5">Submit</Button>
                    </div>
                </Form>
            </Card>

            <ToastContainer position="top-center" autoClose={3000} />
        </Container>
    );
};

export default HelpSupport;