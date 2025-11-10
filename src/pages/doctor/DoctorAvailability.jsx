import { useEffect, useState } from "react";
import { getDoctorAvailability, updateDoctorAvailability } from "../../services/doctorAPI";
import { Container, Card, Button, Form, Row, Col, Spinner } from "react-bootstrap";
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

const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hour, minute] = timeString.split(":");
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
};

const DoctorAvailability = () => {
    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                const data = await getDoctorAvailability();
                
                const mergedAvailability = daysOfWeek.map(day => {
                    const found = data.find(item => item.day === day);
                    return found || { day, startTime: "", endTime: "" };
                });

                setAvailability(mergedAvailability);
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
                toast.error(`On ${slot.day}, start time must be before end time`);
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
            <h2 className="text-center mb-4 fw-semibold">Doctor Availability</h2>

            <Card className="p-4 shadow-sm border-0 rounded-3">
                <p className="text-muted mb-4">
                    Set your available hours for each day. Leave blank for days you are unavailable.
                </p>

                <div className="border-top pt-3">
                    {availability.map((slot, index) => (
                        <Row key={slot.day} className="align-items-center mb-3">
                            <Col md={3}>
                                <strong>{slot.day}</strong>
                            </Col>

                            <Col md={4}>
                                <Form.Label className="fw-light small text-muted mb-1">
                                    Start Time
                                </Form.Label>
                                <Form.Control
                                    type="time"
                                    value={slot.startTime}
                                    onChange={(e) =>
                                        handleChange(index, "startTime", e.target.value)
                                    }
                                />
                                {slot.startTime && (
                                    <small className="text-secondary">
                                        {formatTime(slot.startTime)}
                                    </small>
                                )}
                            </Col>

                            <Col md={4}>
                                <Form.Label className="fw-light small text-muted mb-1">
                                    End Time
                                </Form.Label>
                                <Form.Control
                                    type="time"
                                    value={slot.endTime}
                                    onChange={(e) =>
                                        handleChange(index, "endTime", e.target.value)
                                    }
                                />
                                {slot.endTime && (
                                    <small className="text-secondary">
                                        {formatTime(slot.endTime)}
                                    </small>
                                )}
                            </Col>
                        </Row>
                    ))}
                </div>

                <div className="text-end mt-4">
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4"
                    >
                        {saving ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="me-2"
                                />
                                Saving...
                            </>
                        ) : (
                            "Save Availability"
                        )}
                    </Button>
                </div>
            </Card>

            <ToastContainer position="top-center" autoClose={2500} />
        </Container>
    );
};

export default DoctorAvailability;