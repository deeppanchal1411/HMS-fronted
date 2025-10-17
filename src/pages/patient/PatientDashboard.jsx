import { useEffect, useState } from "react";
import { Badge, Button, Card, Col, Container, Row, Spinner, Table } from "react-bootstrap";
import { useNavigate, useOutletContext } from "react-router-dom";
import { FaBirthdayCake, FaCalendarAlt, FaEnvelope, FaPhoneAlt, FaUser, FaVenusMars } from "react-icons/fa";
import { getUpcomingAppointment } from "../../services/patientAPI";
import { getStatusBadgeVariant } from "../../utils/appointmentUtils";
import LoadingSpinner from "../../components/LoadingSpinner";

const PatientDashboard = () => {
    const navigate = useNavigate();
    const { user } = useOutletContext();

    const [appointments, setAppointments] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [randomTips, setRandomTips] = useState([]);

    const healthTips = [
        "🥦 Eat more fiber-rich foods to improve digestion and heart health.",
        "🚶‍♂️ Walk at least 30 minutes a day to maintain cardiovascular health.",
        "💧 Drink at least 8 glasses of water daily to stay hydrated.",
        "🧘‍♀️ Practice deep breathing or meditation to reduce stress.",
        "😴 Get at least 7–8 hours of sleep every night.",
    ];

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const upcoming = await getUpcomingAppointment();
                setAppointments(upcoming.slice(0, 3));

            } catch (err) {
                console.error("Error loading dashboard:", err);
                setError("Failed to load your appointments. Please try again later.");

            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    useEffect(() => {
        const shuffled = [...healthTips].sort(() => 0.5 - Math.random());
        setRandomTips(shuffled.slice(0, 3));
    }, []);

    if (loading) {
        return <LoadingSpinner fullscreen message="Loading dashboard..." variant="primary" size="lg" />;
    };

    if (error) {
        return (
            <Container className="text-center mt-5">
                <p className="text-danger">{error}</p>
            </Container>
        );
    };

    return (
        <div className="d-flex" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
            <Container fluid className="mt-4">
                <Row>
                    <Col md={12}>
                        <h4>Welcome, {user?.name} 👋</h4>
                        <hr />
                    </Col>

                    <Col md={5}>
                        <Card className="p-3 shadow-sm rounded-4 mb-4">
                            <h5 className="mb-3"><FaUser className="me-2 text-primary" />User Profile</h5><hr className="mt-1 mb-2" />
                            <p><strong><FaUser className="me-2" />Name:</strong> {user?.name} </p>
                            <p><strong><FaEnvelope className="me-2" />Email:</strong> {user?.email} </p>
                            <p><strong><FaPhoneAlt className="me-2" />phone:</strong> {user?.phone} </p>
                            <p><strong><FaVenusMars className="me-2" />Gender:</strong> {user?.gender} </p>
                            <p><strong><FaBirthdayCake className="me-2" />Date of Birth:</strong> {new Date(user?.dob).toLocaleDateString("en-GB")} </p>
                        </Card>
                    </Col>

                    <Col md={7}>
                        <Card className="p-3 shadow-sm rounded-4 mb-4">
                            <h5 className="mb-3"><FaCalendarAlt className="me-2 text-primary" />Recent Appointments</h5>
                            <hr className="mt-1 mb-2" />
                            {appointments.length > 0 ? (
                                <>
                                    <Table bordered hover responsive>
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Time</th>
                                                <th>Doctor</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {appointments.map((appt, idx) => (
                                                <tr key={idx}>
                                                    <td>{new Date(appt.date).toLocaleDateString("en-GB")}</td>
                                                    <td>{appt.time}</td>
                                                    <td>{appt.doctorName}</td>
                                                    <td><Badge bg={getStatusBadgeVariant(appt.status)}>{appt.status}</Badge></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>

                                    <div className="d-flex justify-content-between mt-3">
                                        <Button variant="outline-primary" onClick={() => navigate('/patient/book-appointment')}>
                                            Book Appointment
                                        </Button>
                                        <Button variant="secondary" onClick={() => navigate('/patient/appointments')}>
                                            View All
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p>No recent appointments.</p>
                                    <Button variant="primary" onClick={() => navigate('/patient/book-appointment')}>
                                        Book New Appointment
                                    </Button>
                                </>
                            )}
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Card className="p-3 shadow-sm rounded-4 mb-4">
                            <h5 className="mb-3 text-warning"><FaCalendarAlt className="me-2" />Reminders</h5>
                            <hr className="mt-1 mb-3" />
                            <ul className="list-unstyled mb-0">
                                <li className="mb-3">
                                    🩺 <strong>Appointment with Dr. {appointments?.[0]?.doctorName || "____"}</strong> on <strong>{appointments?.[0] ? new Date(appointments[0].date).toLocaleDateString('en-GB') : "--"}</strong> at <strong>{appointments?.[0]?.time || "--"}</strong>.
                                </li>

                                <li className="mb-3">
                                    💊 <strong>Medication Refill:</strong> Remember to refill your blood pressure medicine this week.
                                </li>

                                <li className="mb-3">
                                    🔁 <strong>Health Checkup:</strong> It's time for your annual health screening.
                                </li>
                            </ul>
                        </Card>
                    </Col>

                    <Col md={6}>
                        <Card className="p-3 shadow-sm rounded-4 mb-4 bg-light">
                            <h5 className="mb-3 text-success"><FaUser className="me-2" />Health Tips</h5>
                            <hr className="mt-1 mb-3" />
                            <ul className="list-unstyled mb-0">
                                {randomTips.map((tip, index) => (
                                    <li key={index} className="mb-3">{tip}</li>
                                ))}
                            </ul>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default PatientDashboard;