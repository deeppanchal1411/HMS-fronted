import axios from "axios";
import { useEffect, useState } from "react";
import { Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { API_BASE_URL } from "../../utils/api.js";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";

const DoctorsPage = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/doctors`);
                setDoctors(res.data);
            } catch (err) {
                console.error("Error fetching doctors:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    if (loading) {
        return <LoadingSpinner fullscreen message="Loading doctors..." variant="primary" size="lg" />;
    };

    return (
        <Container className="my-5">
            <h2 className="text-center mb-4 fw-bold" style={{ color: "#338dd7" }}>Meet Our Expert Doctors</h2>
            <p className="text-center text-muted mb-5 fs-5">
                Our team of experienced and specialized doctors is here to provide the best healthcare for you.
            </p>
            
            <Row>
                {doctors.length > 0 ? (
                    doctors.map((doc) => (
                        <Col key={doc._id} md={4} sm={6} className="mb-4">
                            <Card className="h-100 doctor-card">
                                {doc.image && (
                                    <Card.Img
                                        variant="top"
                                        src={doc.image}
                                        alt={doc.name}
                                    />
                                )}
                                <Card.Body className="text-center">
                                    <Card.Title className="fw-bold" style={{ color: "#338dd7" }}>{doc.name}</Card.Title>
                                    
                                    <Card.Text className="text-muted">
                                        <strong>Specialization:</strong> {doc.specialization} <br />
                                        <strong>Experience:</strong> {doc.experience} years <br />
                                        <strong>Gender:</strong> {doc.gender}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <p className="text-center">No doctors found.</p>
                )}
            </Row>
        </Container>
    );
};

export default DoctorsPage;