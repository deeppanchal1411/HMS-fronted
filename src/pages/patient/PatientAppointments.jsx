import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Modal, Row, Spinner } from "react-bootstrap";
import { cancelAppointment, getPatientAppointments } from "../../services/patientAPI";
import Swal from "sweetalert2";
import { getStatusBadgeVariant } from "../../utils/appointmentUtils";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";

const PatientAppointments = () => {
    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);
    const [filters, setFilters] = useState({
        status: "",
        date: "",
    });
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isCancelling, setIsCancelling] = useState(false);

    const fetchAppointments = async () => {
        try {
            const data = await getPatientAppointments(filters);
            setAppointments(data);
        } catch (err) {
            console.error("Error fetching appointments:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [filters]);

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleAppointmentClick = (apt) => {
        setSelectedAppointment(apt);
        setShowModal(true);
    };

    const handleCancel = async () => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to cancel this appointment?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, cancel it!",
            cancelButtonText: "No, keep it"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    setIsCancelling(true);
                    await cancelAppointment(selectedAppointment._id);
                    Swal.fire("Cancelled!", "Your appointment has been cancelled.", "success");
                    setShowModal(false);
                    fetchAppointments();
                } catch (error) {
                    Swal.fire("Error!", "Failed to cancel the appointment.", "error");
                } finally {
                    setIsCancelling(false);
                }
            }
        });
    };

    if (loading) {
        return <LoadingSpinner fullscreen message="Loading appointments..." variant="primary" size="lg" />;
    };

    return (
        <Container className="mt-4">
            <h3 className="mb-3">My Appointments</h3>

            <Row className="mb-3">
                <Col md={3}>
                    <Form.Select name="status" value={filters.status} onChange={handleChange}>
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </Form.Select>
                </Col>

                <Col md={3}>
                    <Form.Control
                        type="date"
                        name="date"
                        value={filters.date}
                        onChange={handleChange}
                    />
                </Col>

                <Col md={2}>
                    <Button variant="secondary" onClick={() => setFilters({ status: "", date: "" })}>
                        Reset
                    </Button>
                </Col>
            </Row>

            <Row>
                {appointments.length > 0 ? (
                    appointments.map((apt) => (
                        <Col md={6} key={apt._id} className="mb-3">
                            <Card className="shadow-sm" onClick={() => handleAppointmentClick(apt)} style={{ cursor: "pointer" }}>
                                <Card.Body>
                                    <Card.Title>
                                        {apt.doctor?.name} ({apt.doctor?.specialization})
                                    </Card.Title>
                                    <Card.Text>
                                        <strong>Date:</strong> {new Date(apt.date).toLocaleDateString("en-GB")} <br />
                                        <strong>Time:</strong> {apt.time} <br />
                                        <strong>Status:</strong>{" "}
                                        <span className={`badge bg-${getStatusBadgeVariant(apt.status)}`}>
                                            {apt.status}
                                        </span>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col className="text-center mt-4">
                        <p className="text-muted">📅 No appointments match your filter.</p>

                        <Button variant="primary" onClick={() => navigate('/patient/book-appointment')}>
                            Book New Appointment
                        </Button>
                    </Col>

                )}
            </Row>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Appointment Details</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {selectedAppointment && (
                        <>
                            <p><strong>Doctor:</strong> {selectedAppointment.doctor?.name} ({selectedAppointment.doctor?.specialization})</p>
                            <p><strong>Department:</strong> {selectedAppointment.department}</p>
                            <p><strong>Date:</strong> {new Date(selectedAppointment.date).toLocaleDateString("en-GB")}</p>
                            <p><strong>Time:</strong> {selectedAppointment.time}</p>
                            <p><strong>Status:</strong> {selectedAppointment.status}</p>
                            <p><strong>Symptoms:</strong> {selectedAppointment.symptoms || "N/A"}</p>
                        </>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>

                    {selectedAppointment?.status === "pending" && (
                        <Button variant="danger" onClick={handleCancel} disabled={isCancelling}>
                            {isCancelling ? <Spinner size="sm" animation="border" /> : "Cancel Appointment"}
                        </Button>

                    )}
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default PatientAppointments;