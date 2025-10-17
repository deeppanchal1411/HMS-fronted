import { useEffect, useState } from "react";
import { deletePatient, getAllPatients } from "../../services/adminAPI";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import { Button, Container, Form, InputGroup, Spinner, Table } from "react-bootstrap";
import LoadingSpinner from "../../components/LoadingSpinner";

const ManagePatients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");

    const fetchPatients = async () => {
        try {
            const data = await getAllPatients();
            setPatients(data.patients || []);
            setFilteredPatients(data.patients || []);
        } catch (err) {
            toast.error("Failed to load patients");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    useEffect(() => {
        const lowerSearch = searchTerm.toLowerCase();
        const filtered = patients.filter(
            (p) =>
                p.name.toLowerCase().includes(lowerSearch) ||
                p.phone.includes(lowerSearch)
        );
        setFilteredPatients(filtered);
    }, [searchTerm, patients]);

    const handleSort = (field) => {
        const order = field === sortField && sortOrder === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortOrder(order);

        const sorted = [...filteredPatients].sort((a, b) => {
            let valA = a[field] || "";
            let valB = b[field] || "";

            if (typeof valA === "string") valA = valA.toLowerCase();
            if (typeof valB === "string") valB = valB.toLowerCase();

            if (valA < valB) return order === "asc" ? -1 : 1;
            if (valA > valB) return order === "desc" ? 1 : -1;
            return 0;
        });

        setFilteredPatients(sorted);
    };

    const handleDeleteClick = (patientId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This patient record will be deleted permanently.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deletePatient(patientId);
                    toast.success("Patient deleted successfully");
                    setPatients(patients.filter((p) => p._id !== patientId));
                } catch (err) {
                    toast.error("Failed to delete patient");
                }
            }
        });
    };

    if (loading) {
        return (
            <LoadingSpinner
                message="Loading patients..."
                variant="primary"
                size="lg"
                fullscreen
            />
        );
    };

    return (
        <Container className="mt-4">
            <ToastContainer />
            <h3>Manage Patients</h3>

            <InputGroup className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="Search by name or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </InputGroup>

            <Table striped bordered hover responsive className="mt-2">
                <thead>
                    <tr>
                        <th>
                            Name{" "}
                            <Button
                                variant="link"
                                size="sm"
                                onClick={() => handleSort("name")}
                            >
                                {sortField === "name" && sortOrder === "asc" ? "▲" : "▼"}
                            </Button>
                        </th>

                        <th>DOB</th>
                        <th>Gender</th>

                        <th>
                            Phone{" "}
                            <Button
                                variant="link"
                                size="sm"
                                onClick={() => handleSort("phone")}
                            >
                                {sortField === "phone" && sortOrder === "asc" ? "▲" : "▼"}
                            </Button>
                        </th>

                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredPatients.length > 0 ? (
                        filteredPatients.map((patient) => (
                            <tr key={patient._id}>
                                <td>{patient.name}</td>
                                <td>{patient.dob ? new Date(patient.dob).toLocaleDateString() : "N/A"}</td>
                                <td>{patient.gender}</td>
                                <td>{patient.phone}</td>
                                <td>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDeleteClick(patient._id)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">
                                No patients found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </Container>
    )
};

export default ManagePatients;