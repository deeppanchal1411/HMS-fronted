import { useEffect, useState } from "react";
import { addDoctor, deleteDoctor, getAllDoctors, updateDoctor } from "../../services/adminAPI";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import { Button, Container, Form, Modal, Spinner, Table } from "react-bootstrap";
import LoadingSpinner from "../../components/LoadingSpinner";

const ManageDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newDoctor, setNewDoctor] = useState({
        name: "",
        phone: "",
        specialization: "",
        experience: "",
        gender: "",
        password: "",
        confirmPassword: ""
    });
    const [addErrors, setAddErrors] = useState({});

    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [editErrors, setEditErrors] = useState({});

    const fetchDoctors = async () => {
        try {
            const data = await getAllDoctors();
            setDoctors(data.doctors || []);
        } catch (err) {
            toast.error("Failed to load doctors");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (showAddModal) {
            setNewDoctor({
                name: "",
                phone: "",
                specialization: "",
                experience: "",
                gender: "",
                password: "",
                confirmPassword: ""
            });
            setAddErrors({});
        }
        fetchDoctors();
    }, [showAddModal]);

    const handleDeleteClick = (doctorId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This doctor will be deleted permanently.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteDoctor(doctorId);
                    toast.success("Doctor deleted successfully");
                    setDoctors(doctors.filter((doc) => doc._id !== doctorId));
                } catch (err) {
                    toast.error("Failed to delete doctor");
                }
            }
        });
    };

    const validateDoctor = (doctor, mode = "add") => {
        const errors = {};

        if (!doctor.name.trim()) errors.name = "Name is required";

        if (!doctor.phone) errors.phone = "Phone is required";
        else if (!/^\d{10,}$/.test(doctor.phone))
            errors.phone = "Invalid phone number";

        if (!doctor.specialization.trim())
            errors.specialization = "Specialization is required";

        if (!String(doctor.experience).trim())
            errors.experience = "Experience is required";
        else if (isNaN(doctor.experience) || Number(doctor.experience) < 0) {
            errors.experience = "Experience must be a non-negative number";
        }

        if (!doctor.gender) errors.gender = "Select gender";

        if (mode === "add") {
            if (!doctor.password) errors.password = "Password is required";
            else if (doctor.password.length < 6)
                errors.password = "Password must be at least 6 characters";

            if (!doctor.confirmPassword)
                errors.confirmPassword = "Confirm Password is required";
            else if (doctor.password !== doctor.confirmPassword)
                errors.confirmPassword = "Passwords do not match";
        }

        return errors;
    };

    const handleAddChange = (e) => {
        setNewDoctor({ ...newDoctor, [e.target.name]: e.target.value });
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        const errors = validateDoctor(newDoctor, "add");
        setAddErrors(errors);
        if (Object.keys(errors).length > 0) return;

        try {
            const data = await addDoctor(newDoctor);
            toast.success(data.message);
            setShowAddModal(false);
            setDoctors((prev) => [...prev, data.doctor]);
        } catch (err) {
            toast.error("Failed to add doctor");
        }
    };

    const handleEditClick = (doctor) => {
        setSelectedDoctor(doctor);
        setShowEditModal(true);
        setEditErrors({});
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setSelectedDoctor((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const errors = validateDoctor(selectedDoctor, "edit");
        setEditErrors(errors);
        if (Object.keys(errors).length > 0) return;

        try {
            const data = await updateDoctor(selectedDoctor._id, selectedDoctor);
            toast.success("Doctor updated successfully");
            setShowEditModal(false);
            setDoctors((prev) =>
                prev.map((doc) => (doc._id === selectedDoctor._id ? data.doctor : doc))
            );
        } catch (err) {
            toast.error("Failed to update doctor");
        }
    };

    if (loading) {
        return (
            <LoadingSpinner
                message="Loading doctors..."
                variant="primary"
                size="lg"
                fullscreen
            />
        );
    };

    return (
        <Container className="mt-4">
            <ToastContainer />
            <h3>Manage Doctors</h3>

            <Button variant="primary" className="mb-3" onClick={() => setShowAddModal(true)}>
                Add Doctor
            </Button>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Gender</th>
                        <th>Phone</th>
                        <th>Specialization</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {doctors.length > 0 ? doctors.map((doctor) => (
                        <tr key={doctor._id}>
                            <td>{doctor.name}</td>
                            <td>{doctor.gender}</td>
                            <td>{doctor.phone}</td>
                            <td>{doctor.specialization}</td>
                            <td>
                                <Button variant="info" size="sm" className="me-2" onClick={() => handleEditClick(doctor)}>Edit</Button>
                                <Button variant="danger" size="sm" onClick={() => handleDeleteClick(doctor._id)}>Delete</Button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="5" className="text-center">No doctors found.</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Form onSubmit={handleEditSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Doctor</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        {selectedDoctor && (
                            <>
                                <Form.Group className="mb-3">
                                    <Form.Label>Name:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={selectedDoctor.name}
                                        onChange={handleEditChange}
                                        isInvalid={!!editErrors.name}
                                    />
                                    <Form.Control.Feedback type="invalid">{editErrors.name}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Phone:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="phone"
                                        value={selectedDoctor.phone}
                                        onChange={handleEditChange}
                                        isInvalid={!!editErrors.phone}
                                    />
                                    <Form.Control.Feedback type="invalid">{editErrors.phone}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Specialization:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="specialization"
                                        value={selectedDoctor.specialization}
                                        onChange={handleEditChange}
                                        isInvalid={!!editErrors.specialization}
                                    />
                                    <Form.Control.Feedback type="invalid">{editErrors.specialization}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Experience (years):</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="experience"
                                        value={selectedDoctor.experience}
                                        onChange={handleEditChange}
                                        isInvalid={!!editErrors.experience}
                                    />
                                    <Form.Control.Feedback type="invalid">{editErrors.experience}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Gender:</Form.Label>
                                    <Form.Select
                                        name="gender"
                                        value={selectedDoctor.gender}
                                        onChange={handleEditChange}
                                        isInvalid={!!editErrors.gender}
                                    >
                                        <option value="">Select gender</option>
                                        <option value="male">male</option>
                                        <option value="female">female</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">{editErrors.gender}</Form.Control.Feedback>
                                </Form.Group>
                            </>
                        )}
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                            Cancel
                        </Button>

                        <Button variant="primary" type="submit">
                            Update Doctor
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Form onSubmit={handleAddSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Doctor</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={newDoctor.name}
                                onChange={handleAddChange}
                                isInvalid={!!addErrors.name}
                                placeholder="Enter name"
                            />
                            <Form.Control.Feedback type="invalid">{addErrors.name}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Phone:</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone"
                                value={newDoctor.phone}
                                onChange={handleAddChange}
                                isInvalid={!!addErrors.phone}
                                placeholder="Enter number"
                            />
                            <Form.Control.Feedback type="invalid">{addErrors.phone}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Specialization:</Form.Label>
                            <Form.Control
                                type="text"
                                name="specialization"
                                value={newDoctor.specialization}
                                onChange={handleAddChange}
                                isInvalid={!!addErrors.specialization}
                                placeholder="Enter specialization"
                            />
                            <Form.Control.Feedback type="invalid">{addErrors.specialization}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Experience (years):</Form.Label>
                            <Form.Control
                                type="text"
                                name="experience"
                                value={newDoctor.experience}
                                onChange={handleAddChange}
                                isInvalid={!!addErrors.experience}
                                placeholder="Enter experience"
                            />
                            <Form.Control.Feedback type="invalid">{addErrors.experience}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Gender:</Form.Label>
                            <Form.Select
                                name="gender"
                                value={newDoctor.gender}
                                onChange={handleAddChange}
                                isInvalid={!!addErrors.gender}
                            >
                                <option value="">Select gender</option>
                                <option value="male">male</option>
                                <option value="female">female</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">{addErrors.gender}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password:</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={newDoctor.password}
                                onChange={handleAddChange}
                                isInvalid={!!addErrors.password}
                                placeholder="Enter password"
                            />
                            <Form.Control.Feedback type="invalid">{addErrors.password}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Confirm Password:</Form.Label>
                            <Form.Control
                                type="password"
                                name="confirmPassword"
                                value={newDoctor.confirmPassword}
                                onChange={handleAddChange}
                                isInvalid={!!addErrors.confirmPassword}
                                placeholder="Enter confirm password"
                            />
                            <Form.Control.Feedback type="invalid">{addErrors.confirmPassword}</Form.Control.Feedback>
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                            Close
                        </Button>

                        <Button variant="primary" type="submit">
                            Add Doctor
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default ManageDoctors;