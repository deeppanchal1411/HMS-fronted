import { useEffect, useState } from "react";
import { getDoctorAvailability, updateDoctorAvailability } from "../../services/doctorAPI";
import { Container, Card, Button, Form, Row, Col } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import LoadingSpinner from "../../components/LoadingSpinner";

const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

const DoctorAvailability = () => {
    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                const data = await getDoctorAvailability();
                setAvailability(data.length ? data : daysOfWeek.map(day => ({
                    day,
                    startTime: "",
                    endTime: ""
                })));
            } catch (err) {
                toast.error("Failed to load availability");
            } finally {
                setLoading(false);
            }
        };

        fetchAvailability();
    }, []);

    const handleChange = (index, field, value) => {
        const updated = [...availability];
        updated[index][field] = value;
        setAvailability(updated);
    };

    const handleSave = async () => {
        for (const slot of availability) {
            if (slot.startTime && slot.endTime && slot.startTime >= slot.endTime) {
                toast.error(`In ${slot.day}, start time must be before end time`);
                return;
            }
        }

        setSaving(true);

        try {
            await updateDoctorAvailability(availability);
            toast.success("Availability updated successfully");
        } catch {
            toast.error("Failed to update availability");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <LoadingSpinner fullscreen message="Updating Availability..." variant="primary" size="lg" />;
    };

    return (
        <Container className="mt-4">
            <h3>Set Your Availability</h3>

            <Card className="p-3 shadow-sm">
                {availability.map((slot, index) => (
                    <Row key={slot.day} className="align-items-center mb-3">
                        <Col md={3}><strong>{slot.day}</strong></Col>

                        <Col md={4}>
                            <Form.Control
                                type="time"
                                value={slot.startTime}
                                onChange={(e) => handleChange(index, "startTime", e.target.value)}
                            />
                        </Col>

                        <Col md={4}>
                            <Form.Control
                                type="time"
                                value={slot.endTime}
                                onChange={(e) => handleChange(index, "endTime", e.target.value)}
                            />
                        </Col>
                    </Row>
                ))}

                <Button variant="primary" onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : "Save Availability"}
                </Button>
            </Card>

            <ToastContainer position="top-center" autoClose={3000} />
        </Container>
    );
};

export default DoctorAvailability;