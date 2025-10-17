import { useEffect, useState } from "react";
import { getDoctorDashboard } from "../../services/doctorAPI";
import { Card, Col, Container, Row, Spinner, Table } from "react-bootstrap";
import LoadingSpinner from "../../components/LoadingSpinner";

const DoctorDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboard = async () => {
        try {
            const data = await getDoctorDashboard();
            setStats(data);
        } catch (err) {
            console.error("Failed to load doctor dashboard", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    if (loading) {
        return <LoadingSpinner fullscreen message="Loading dashboard..." variant="primary" size="lg" />;
    };

    return (
        <Container fluid className="mt-4 doctor-content">
            <h3 className="mb-4">Doctor Dashboard</h3>

            <Row className="mb-4">
                <Col md={3}>
                    <Card className="text-center shadow-sm">
                        <Card.Body>
                            <Card.Title>Total Appointments</Card.Title>
                            <h4>{stats?.totalAppointments || 0}</h4>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={3}>
                    <Card className="text-center shadow-sm">
                        <Card.Body>
                            <Card.Title>Today's Appointments</Card.Title>
                            <h4>{stats?.todayAppointments || 0}</h4>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={3}>
                    <Card className="text-center shadow-sm">
                        <Card.Body>
                            <Card.Title>Pending</Card.Title>
                            <h4>{stats?.pendingAppointments || 0}</h4>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={3}>
                    <Card className="text-center shadow-sm">
                        <Card.Body>
                            <Card.Title>Completed</Card.Title>
                            <h4>{stats?.completedAppointments || 0}</h4>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={3} className="mt-3">
                    <Card className="text-center shadow-sm">
                        <Card.Body>
                            <Card.Title>Cancelled</Card.Title>
                            <h4>{stats?.cancelledAppointments || 0}</h4>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card className="shadow-sm">
                <Card.Header>Recent Appointments</Card.Header>
                <Card.Body>
                    {stats?.recentAppointments?.length > 0 ? (
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Patient</th>
                                    <th>Date/Time</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {stats.recentAppointments.map((appt) => (
                                    <tr key={appt._id}>
                                        <td>{appt.patient?.name} ({appt.patient?.phone})</td>
                                        <td>{new Date(appt.dateTime).toLocaleString()}</td>
                                        <td>{appt.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p>No recent appointments found.</p>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default DoctorDashboard;