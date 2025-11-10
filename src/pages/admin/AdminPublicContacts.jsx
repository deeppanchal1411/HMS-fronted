import { useEffect, useState } from "react";
import { Table, Button, Container } from "react-bootstrap";
import Swal from "sweetalert2";
import { getAllPublicContacts, deletePublicContact } from "../../services/adminAPI.js";

const AdminPublicContacts = () => {
    const [contacts, setContacts] = useState([]);

    const fetchContacts = async () => {
        try {
            const res = await getAllPublicContacts();
            setContacts(res.contacts);
            
        } catch (err) {
            console.error("Error fetching contacts:", err);
            Swal.fire("Error", "Failed to load public contact messages", "error");
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This action will permanently delete the message.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
            try {
                await deletePublicContact(id);
                await fetchContacts();

                Swal.fire({
                    title: "Deleted!",
                    text: "The message has been deleted successfully.",
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
            <h3 className="mb-4">Public Contact Messages</h3>

            <Table striped bordered hover responsive className="shadow-sm">
                <thead className="table-primary">
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Message</th>
                        <th>Date</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {contacts.length > 0 ? (
                        contacts.map((msg) => (
                            <tr key={msg._id}>
                                <td>{msg.name}</td>
                                <td>{msg.email}</td>
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
                            <td colSpan="5" className="text-center text-muted">
                                No public contact messages found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </Container>
    );
};

export default AdminPublicContacts;