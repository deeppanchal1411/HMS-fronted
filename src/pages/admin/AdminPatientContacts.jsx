import { useEffect, useState } from "react";
import { Table, Button, Container } from "react-bootstrap";
import Swal from "sweetalert2";
import { getAllPatientContacts, deletePatientContact } from "../../services/adminAPI.js";

const AdminPatientContacts = () => {
    const [contacts, setContacts] = useState([]);

    const fetchContacts = async () => {
        try {
            const res = await getAllPatientContacts();
            console.log("📦 Patient Contacts Response:", res.contacts);
            setContacts(res.contacts);
            
        } catch (err) {
            console.error("Error fetching patient contacts:", err);
            Swal.fire("Error", "Failed to load patient contact messages", "error");
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This will permanently delete the message.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
            try {
                await deletePatientContact(id);
                await fetchContacts();
                Swal.fire({
                    title: "Deleted!",
                    text: "Message deleted successfully.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: true,
                });
            } catch (err) {
                console.error("Error deleting contact:", err);
                Swal.fire("Error", "Failed to delete the message", "error");
            }
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    return (
        <Container className="mt-4">
            <h3 className="mb-4">Patient Contact Messages</h3>

            <Table striped bordered hover responsive className="shadow-sm">
                <thead className="table-primary">
                    <tr>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Subject</th>
                        <th>Message</th>
                        <th>Date</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {contacts.length > 0 ? (
                        contacts.map((msg) => (
                            <tr key={msg._id}>
                                <td>{msg.user?.name || "N/A"}</td>
                                <td>
                                    {msg.user?.phone ? (
                                        <a href={`tel:${msg.user.phone}`}>{msg.user.phone}</a>
                                    ) : (
                                        "N/A"
                                    )}
                                </td>
                                <td>{msg.subject}</td>
                                <td>{msg.message}</td>
                                <td>{new Date(msg.createdAt).toLocaleString()}</td>
                                <td>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDelete(msg._id)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center text-muted">
                                No patient contact messages found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </Container>
    );
};

export default AdminPatientContacts;