import { useEffect, useState } from "react";
import { bookNewAppointment, getAvailableSlots, getDoctorsList } from "../../services/patientAPI";
import { toast, ToastContainer } from "react-toastify";
import { Button, Card, Container, Form, Spinner } from "react-bootstrap";
import LoadingSpinner from "../../components/LoadingSpinner";

const PatientBookAppointment = () => {

    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [availableSlots, setAvailableSlots] = useState([]);
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
                const data = await getDoctorsList();
                setDoctors(data);
            } catch (err) {
                console.error("Error fetching doctors:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    useEffect(() => {
        const fetchSlots = async () => {
            if (!formData.doctorId || !formData.date) {
                setAvailableSlots([]);
                setFormData(prev => ({ ...prev, time: "" }));
                return;
            }
            setSlotsLoading(true);
            try {
                const data = await getAvailableSlots(formData.doctorId, formData.date);

                let slots = data.slots || [];

                const selectedDate = new Date(formData.date);
                const today = new Date();

                if (
                    selectedDate.getFullYear() === today.getFullYear() &&
                    selectedDate.getMonth() === today.getMonth() &&
                    selectedDate.getDate() === today.getDate()
                ) {
                    const nowMinutes = today.getHours() * 60 + today.getMinutes();

                    slots = slots.filter(slot => {
                        const [hour, minute] = slot.split(":").map(Number);
                        const slotMinutes = hour * 60 + minute;
                        return slotMinutes > nowMinutes;
                    });
                }

                setAvailableSlots(slots);
                setFormData(prev => ({ ...prev, time: "" }));

            } catch (err) {
                console.error("Error fetching slots:", err);
                toast.error("Failed to fetch available time slots.");
                
            } finally {
                setSlotsLoading(false);
            }
        };
        fetchSlots();
    }, [formData.doctorId, formData.date]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "doctorId") {
            const selectedDoctor = doctors.find(doc => doc._id === value);
            if (selectedDoctor) {
                setFormData({
                    ...formData,
                    doctorId: value,
                    department: selectedDoctor.specialization,
                    time: ""
                });
            }
        } else if (name === "date") {
            setFormData({
                ...formData,
                date: value,
                time: ""
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const dataToSend = {
                doctorId: formData.doctorId,
                date: formData.date,
                time: formData.time,
                symptoms: formData.symptoms,
                department: formData.department
            };
            await bookNewAppointment(dataToSend);
            toast.success("Appointment booked successfully!");
            setFormData({
                doctorId: "",
                date: "",
                time: "",
                symptoms: "",
                department: ""
            });
            setAvailableSlots([]);

        } catch (err) {
            toast.error(err.response?.data?.error || "Error booking appointment");

        } finally {
            setSubmitting(false);
        }
    };

    const formatTime = (timeStr) => {
        const [hour, minute] = timeStr.split(":").map(Number);
        const date = new Date();
        date.setHours(hour, minute);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (loading) {
        return <LoadingSpinner fullscreen message="Booking appointment..." variant="primary" size="lg" />;
    };

    return (
        <Container className="mt-4">
            <h2 className="text-center mb-4">📅 Book an Appointment</h2>
            <Card className="p-4 shadow-lg rounded">
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-4">
                        <Form.Label><strong>Doctor & Department :</strong></Form.Label>
                        <Form.Select name="doctorId" value={formData.doctorId} onChange={handleChange} required>
                            <option value="">-- Select Doctor --</option>
                            {doctors.map((doc) => (
                                <option key={doc._id} value={doc._id}>
                                    {doc.name} ({doc.specialization})
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label><strong>Date :</strong></Form.Label>
                        <Form.Control
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            min={new Date().toISOString().split("T")[0]}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label><strong>Time :</strong></Form.Label>
                        {slotsLoading ? (
                            <div><Spinner animation="border" size="sm" /> Loading slots...</div>
                        ) : (
                            <Form.Select
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                required
                                disabled={!availableSlots.length}
                            >
                                <option value="">{availableSlots.length > 0 ? "-- Select Time Slot --" : "No slots available"}</option>
                                {availableSlots.map((slot, idx) => (
                                    <option key={idx} value={slot}>
                                        {formatTime(slot)}
                                    </option>
                                ))}
                            </Form.Select>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label><strong>Symptoms :</strong></Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="symptoms"
                            placeholder="Describe your symptoms..."
                            value={formData.symptoms}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <div className="d-grid">
                        <Button variant="primary" type="submit" size="lg" disabled={submitting || slotsLoading}>
                            {submitting ? <Spinner animation="border" size="sm" /> : "Book Appointment"}
                        </Button>
                    </div>
                </Form>
            </Card>

            <ToastContainer position="top-center" autoClose={3000} />
        </Container>
    );
};

export default PatientBookAppointment;