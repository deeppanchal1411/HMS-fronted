import { useEffect, useState } from "react";
import { getDoctorPatients } from "../../services/doctorAPI";
import { Container, Form, Spinner, Table } from "react-bootstrap";
import LoadingSpinner from "../../components/LoadingSpinner";

const DoctorPatients = () => {
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const data = await getDoctorPatients();
            setPatients(data);
            setFilteredPatients(data);
        } catch (err) {
            console.error("Error fetching patients", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearch(value);
        setFilteredPatients(
            patients.filter(
                (p) =>
                    p.name?.toLowerCase().includes(value) ||
                    p.phone?.includes(value)
            )
        );
    };

    if (loading) {
        return <LoadingSpinner fullscreen message="Loading patients..." variant="primary" size="lg" />;
    };

    return (
        <Container className="mt-4">
            <h2 className="mb-4">My Patients</h2>

            <Form.Control
                type="text"
                placeholder="Search by name or phone"
                value={search}
                onChange={handleSearch}
                className="mb-3"
            />

            <Table striped bordered hover responsive>
                <thead className="table-primary">
                    <tr>
                        <th>Name</th>
                        <th>Gender</th>
                        <th>DOB</th>
                        <th>Phone</th>
                    </tr>
                </thead>
                
                <tbody>
                    {filteredPatients.length > 0 ? (
                        filteredPatients.map((patient) => (
                            <tr key={patient._id}>
                                <td>{patient.name}</td>
                                <td>{patient.gender}</td>
                                <td>{new Date(patient.dob).toLocaleDateString()}</td>
                                <td>{patient.phone}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">
                                No Patients Found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </Container>
    );
};

export default DoctorPatients;