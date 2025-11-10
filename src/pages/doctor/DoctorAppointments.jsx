import { useEffect, useState } from "react";
import { getDoctorAppointments, updateDoctorAppointmentStatus } from "../../services/doctorAPI";
import { toast, ToastContainer } from "react-toastify";
import { Button, Col, Container, Form, Row, Spinner, Table } from "react-bootstrap";
import LoadingSpinner from "../../components/LoadingSpinner";

const DoctorAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        patientName: "",
        date: "",
        time: "",
        status: ""
    });

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const data = await getDoctorAppointments();
            setAppointments(data);
        } catch (err) {
            console.error("Error fetching appointments", err);
            toast.error("Failed to load appointments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleStatusChange = async (id, status) => {
        try {
            const data = await updateDoctorAppointmentStatus(id, status);
            toast.success(data.message);

            setAppointments((prev) =>
                prev.map((appt) =>
                    appt._id === id ? { ...appt, status } : appt
                )
            );

        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = () => {
        fetchAppointments();
    };

    if (loading) {
        return <LoadingSpinner fullscreen message="Loading appointments..." variant="primary" size="lg" />;
    };

    return (
        <Container className="mt-4">
            <ToastContainer />
            <h2 className="mb-4">My appointments</h2>

            <Row className="mb-3">
                <Col md={3}>
                    <Form.Control
                        type="text"
                        placeholder="Search by Patient Name"
                        name="patientName"
                        value={filters.patientName}
                        onChange={handleFilterChange}
                    />
                </Col>

                <Col md={2}>
                    <Form.Control
                        type="date"
                        name="date"
                        value={filters.date}
                        onChange={handleFilterChange}
                    />
                </Col>

                <Col md={2}>
                    <Form.Control
                        type="time"
                        name="time"
                        value={filters.time}
                        onChange={handleFilterChange}
                    />
                </Col>

                <Col md={2}>
                    <Form.Select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </Form.Select>
                </Col>

                <Col md={2}>
                    <Button variant="primary" onClick={handleSearch}>
                        Apply
                    </Button>
                </Col>
            </Row>

            <Table striped bordered hover responsive>
                <thead className="table-primary">
                    <tr>
                        <th>Patient</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Change Status</th>
                    </tr>
                </thead>

                <tbody>
                    {appointments.length > 0 ? (
                        appointments.map((appt) => (
                            <tr key={appt._id}>
                                <td>{appt.patient?.name}</td>
                                <td>{new Date(appt.date).toLocaleDateString()}</td>
                                <td>{appt.time}</td>

                                <td>
                                    <span
                                        className={`fw-bold ${appt.status === "completed"
                                            ? "text-success"
                                            : appt.status === "cancelled"
                                                ? "text-danger"
                                                : "text-warning"
                                            }`}
                                    >
                                        {appt.status}
                                    </span>
                                </td>

                                <td>
                                    <Form.Select
                                        value={appt.status}
                                        onChange={(e) => {
                                            e.preventDefault();
                                            handleStatusChange(appt._id, e.target.value);
                                        }}
                                        size="sm"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </Form.Select>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">
                                No Appointments Found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </Container>
    );
};

export default DoctorAppointments;