import { useEffect, useState } from "react";
import { getAdminStats } from "../../services/adminAPI";
import { toast, ToastContainer } from "react-toastify";
import { Card, Col, Container, Row } from "react-bootstrap";
import LoadingSpinner from "../../components/LoadingSpinner";
import { FaCalendarAlt, FaCalendarDay, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaUserInjured, FaUserMd } from "react-icons/fa";

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

            <Row className="g-4 mb-4">
                <Col md={3}>
                    <Card className="text-center shadow-sm bg-info text-white">
                        <Card.Body>
                            <Card.Title>
                                <FaUserInjured className="me-2" />
                                Total Patients
                            </Card.Title>
                            <h2>{stats.totalPatients}</h2>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={3}>
                    <Card className="text-center shadow-sm bg-primary text-white">
                        <Card.Body>
                            <Card.Title>
                                <FaUserMd className="me-2" />
                                Total Doctors
                            </Card.Title>
                            <h2>{stats.totalDoctors}</h2>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={3}>
                    <Card className="text-center shadow-sm bg-warning text-dark">
                        <Card.Body>
                            <Card.Title>
                                <FaCalendarAlt className="me-2" />
                                Total Appointments
                            </Card.Title>
                            <h2>{stats.totalAppointments}</h2>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={3}>
                    <Card className="text-center shadow-sm bg-success text-white">
                        <Card.Body>
                            <Card.Title>
                                <FaCalendarDay className="me-2" />
                                Today's Appointments
                            </Card.Title>
                            <h2>{stats.todayAppointments}</h2>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <h5 className="mb-3">Appointments Status</h5>
            <Row className="g-4">
                {stats?.statusCounts?.map((status, idx) => {
                    const statusId = status?._id ? status._id.toString() : "unknown";
                    let bgColor = "bg-secondary text-white";
                    let icon = null;

                    switch (statusId.toLowerCase()) {
                        case "pending":
                            bgColor = "bg-warning text-dark";
                            icon = <FaHourglassHalf className="me-2" />;
                            break;

                        case "completed":
                            bgColor = "bg-success text-white";
                            icon = <FaCheckCircle className="me-2" />;
                            break;

                        case "cancelled":
                            bgColor = "bg-danger text-white";
                            icon = <FaTimesCircle className="me-2" />;
                            break;

                        default:
                            bgColor = "bg-secondary text-white";
                            break;
                    }

                    return (
                        <Col md={3} key={statusId || idx}>
                            <Card className={`text-center shadow-sm ${bgColor}`}>
                                <Card.Body>
                                    <Card.Title>
                                        {icon}
                                        {statusId.charAt(0).toUpperCase() + statusId.slice(1)}
                                    </Card.Title>
                                    <h2>{status?.count}</h2>
                                </Card.Body>
                            </Card>
                        </Col>
                    );
                })}
            </Row>

            <Card className="shadow-sm mt-4">
                <Card.Header>Recent Appointments</Card.Header>

                <Card.Body>
                    {stats?.recentAppointments?.length > 0 ? (
                        <table className="table table-striped table-hover align-middle">
                            <thead>
                                <tr>
                                    <th>Patient</th>
                                    <th>Doctor</th>
                                    <th>Date/Time</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {stats.recentAppointments.map((appt) => (
                                    <tr key={appt._id}>
                                        <td>{appt.patient?.name} ({appt.patient?.phone})</td>
                                        <td>{appt.doctor?.name}</td>
                                        <td>
                                            {appt.date
                                                ? `${new Date(appt.date).toLocaleDateString("en-US", {
                                                    dateStyle: "medium",
                                                })} ${appt.time ? `at ${appt.time}` : ""}`
                                                : "No date available"}
                                        </td>

                                        <td>
                                            <span
                                                className={`badge ${appt.status === "completed"
                                                    ? "bg-success"
                                                    : appt.status === "pending"
                                                        ? "bg-warning text-dark"
                                                        : appt.status === "cancelled"
                                                            ? "bg-danger"
                                                            : "bg-secondary"
                                                    }`}
                                            >
                                                {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-muted mb-0">No recent appointments found.</p>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AdminDashboard;