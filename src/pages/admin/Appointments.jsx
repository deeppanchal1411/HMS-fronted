import { useEffect, useState } from "react";
import { getAllAppointments, updateAppointmentStatus } from "../../services/adminAPI";
import { toast, ToastContainer } from "react-toastify";
import { Button, Container, Form, InputGroup, Table } from "react-bootstrap";
import LoadingSpinner from "../../components/LoadingSpinner";

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");

    const fetchAppointments = async () => {
        try {
            const data = await getAllAppointments();
            setAppointments(data.appointments || []);
            setFilteredAppointments(data.appointments || []);
        } catch (err) {
            toast.error("Failed to load appointments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    useEffect(() => {
        const lowerSearch = searchTerm.toLowerCase();
        const filtered = appointments.filter(
            (a) =>
                a.patient?.name?.toLowerCase().includes(lowerSearch) ||
                a.patient?.phone?.includes(lowerSearch) ||
                a.doctor?.name?.toLowerCase().includes(lowerSearch)
        );
        setFilteredAppointments(filtered);
    }, [searchTerm, appointments]);

    const handleSortByDate = () => {
        const order = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(order);

        const sorted = [...filteredAppointments].sort((a, b) => {
            const dateA = new Date(a.dateTime);
            const dateB = new Date(b.dateTime);
            return order === "asc" ? dateA - dateB : dateB - dateA;
        });

        setFilteredAppointments(sorted);
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateAppointmentStatus(id, newStatus);
            toast.success("Appointment status updated");
            fetchAppointments();
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <LoadingSpinner message="Loading appointments..." />
            </div>
        );
    };

    return (
        <Container className="mt-4">
        <ToastContainer />
            <h3>Manage Appointments</h3>

            <InputGroup className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="Search by patient or doctor name/phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </InputGroup>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Patient</th>
                        <th>Doctor</th>

                        <th>
                            Date/Time{" "}
                            <Button
                                variant="link"
                                size="sm"
                                onClick={handleSortByDate}
                            >
                                {sortOrder === "asc" ? "▲" : "▼"}
                            </Button>
                        </th>

                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredAppointments.length > 0 ? (
                        filteredAppointments.map((appt) => (
                            <tr key={appt._id}>
                                <td>
                                    {appt.patient?.name} <br />
                                    <small>{appt.patient?.phone}</small>
                                </td>

                                <td>
                                    {appt.doctor?.name} <br />
                                    <small>{appt.doctor?.specialization}</small>
                                </td>

                                <td>
                                    {new Date(appt.dateTime).toLocaleString()}
                                </td>

                                <td>
                                    <Form.Select
                                        value={appt.status}
                                        onChange={(e) =>
                                            handleStatusChange(appt._id, e.target.value)
                                        }
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
                                No appointments found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </Container>
    );
};

export default Appointments;