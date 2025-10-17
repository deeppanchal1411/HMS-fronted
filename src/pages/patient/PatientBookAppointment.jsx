import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { bookNewAppointment, getDoctorsList } from "../../services/patientAPI";
import { toast, ToastContainer } from "react-toastify";
import { Button, Card, Container, Form, Spinner } from "react-bootstrap";
import LoadingSpinner from "../../components/LoadingSpinner";

const PatientBookAppointment = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("patientToken");

    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        doctorId: "",
        date: "",
        time: "",
        symptoms: "",
        department: ""
    });

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const data = await getDoctorsList(token);
                setDoctors(data);
            } catch (err) {
                console.error("Error fetching doctors:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "doctorId") {
            const selectedDoctor = doctors.find(doc => doc._id === value);
            if (selectedDoctor) {
                setFormData({
                    ...formData,
                    doctorId: value,
                    department: selectedDoctor.specialization
                });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = {
                doctorId: formData.doctorId,
                date: formData.date,
                time: formData.time,
                symptoms: formData.symptoms,
                department: formData.department 
            };
            await bookNewAppointment(token, dataToSend);
            toast.success("Appointment booked successfully!");
            navigate("/patient/appointments");

        } catch (err) {
            toast.error(err.response?.data?.error || "Error booking appointment");
        }
    };

    if (loading) {
        return <LoadingSpinner fullscreen message="Booking appointment..." variant="primary" size="lg" />;
    };

    return (
        <Container className="mt-4">
            <h3>Book New Appointment</h3>
            <Card className="p-4 shadow-sm mt-3">
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Doctor And Department:</Form.Label>
                        <Form.Select name="doctorId" value={formData.doctorId} onChange={handleChange} required>
                            <option value="">Select Doctor</option>
                            {doctors.map((doc) => (
                                <option key={doc._id} value={doc._id} >
                                    {doc.name} ({doc.specialization})
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Date:</Form.Label>
                        <Form.Control
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Time:</Form.Label>
                        <Form.Control
                            type="time"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Symptoms</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="symptoms"
                            value={formData.symptoms}
                            onChange={handleChange}
                            placeholder="Describe your symptoms"
                            rows={3}
                            required
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit">Book Appointment</Button>
                </Form>
            </Card>
            <ToastContainer position="top-center" autoClose={3000} />
        </Container>
    );
};

export default PatientBookAppointment;