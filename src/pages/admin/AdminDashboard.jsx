import { useEffect, useState } from "react";
import { getAdminStats } from "../../services/adminAPI";
import { toast, ToastContainer } from "react-toastify";
import { Card, Col, Container, Row } from "react-bootstrap";
import LoadingSpinner from "../../components/LoadingSpinner";

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const data = await getAdminStats();
            setStats(data);
            setLoading(false);
        } catch (err) {
            toast.error("Failed to load statistics");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) {
        return <LoadingSpinner message="Loading dashboard data..." variant="primary" size="lg" fullscreen />;
    }

    return (
        <Container className="mt-4">
            <ToastContainer />
            <h3 className="mb-4">Admin Dashboard</h3>

            <Row className="g-4">
                <Col md={3}>
                    <Card className="text-center shadow-sm">
                        <Card.Body>
                            <Card.Title>Total Patients</Card.Title>
                            <h2>{stats.totalPatients}</h2>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={3}>
                    <Card className="text-center shadow-sm">
                        <Card.Body>
                            <Card.Title>Total Doctors</Card.Title>
                            <h2>{stats.totalDoctors}</h2>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={3}>
                    <Card className="text-center shadow-sm">
                        <Card.Body>
                            <Card.Title>Total Appointments</Card.Title>
                            <h2>{stats.totalAppointments}</h2>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={3}>
                    <Card className="text-center shadow-sm">
                        <Card.Body>
                            <Card.Title>Today's Appointments</Card.Title>
                            <h2>{stats.todayAppointments}</h2>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <h5>Appointments Status</h5>
            <Row className="g-4">
                {stats?.statusCounts.map((status) => (
                    <Col md={3} key={status._id}>
                        <Card className="text-center shadow-sm">
                            <Card.Body>
                                <Card.Title>{status._id.charAt(0).toUpperCase() + status._id.slice(1)}</Card.Title>
                                <h2>{status.count}</h2>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};
export default AdminDashboard;