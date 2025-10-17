import { Button, Card, Col, Container, Image, Row } from "react-bootstrap";
import { FaClock, FaHeartbeat, FaHospital, FaUserMd } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();

    const fadeInUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0 }
    };

    const services = [
        {
            title: "General Checkup",
            description: "Comprehensive health checkups to keep you healthy and detect issues early.",
            img: "/images/checkup.jpeg"
        },
        {
            title: "Specialist Consultation",
            description: "Consult with experienced doctors across various medical fields.",
            img: "/images/consult.jpg"
        },
        {
            title: "Emergency Care",
            description: "24/7 emergency services for urgent medical attention.",
            img: "/images/emergency.jpeg"
        }
    ];

    const reasons = [
        {
            icon: <FaUserMd size={40} />,
            title: "Expert Doctors",
            text: "Our team consists of highly experienced and certified doctors across multiple specialties."
        },
        {
            icon: <FaHospital size={40} />,
            title: "Modern Facilities",
            text: "State-of-the-art equipment and infrastructure to provide the best healthcare services."
        },
        {
            icon: <FaClock size={40} />,
            title: "24/7 Availability",
            text: "Round-the-clock emergency and teleconsultation services for your convenience."
        },
        {
            icon: <FaHeartbeat size={40} />,
            title: "Patient-Centric Care",
            text: "We prioritize personalized care and attention for every patient."
        }
    ];

    return (
        <>
            <div className="py-5" style={{ background: '#f8f9fa' }}>
                <Container>
                    <Row className="align-items-center">
                        <Col md={6} className="mb-4 mb-md-0">
                            <motion.h1
                                className="fw-bold mb-4"
                                style={{ color: "#338dd7" }}
                                variants={fadeInUp}
                                initial="hidden"
                                animate="visible"
                                transition={{ duration: 0.6 }}
                            >
                                Welcome to Madhuram Hospital
                            </motion.h1>

                            <motion.p
                                className="mb-4 fs-5"
                                style={{ color: "#6c757d" }}
                                variants={fadeInUp}
                                initial="hidden"
                                animate="visible"
                                transition={{ duration: 0.8 }}
                            >
                                Providing compassionate, high-quality healthcare with the latest technologies and expert doctors.
                            </motion.p>

                            <motion.div
                                variants={fadeInUp}
                                initial="hidden"
                                animate="visible"
                                transition={{ duration: 1 }}
                            >
                                <Button
                                    variant="primary"
                                    className="px-4 py-2 me-3 rounded-pill"
                                    onClick={() => navigate('/patient/register')}
                                >
                                    Book Appointment
                                </Button>

                                <Button
                                    variant="outline-primary"
                                    className="px-4 py-2 rounded-pill"
                                    onClick={() => navigate('/doctors')}
                                >
                                    View Doctors
                                </Button>
                            </motion.div>
                        </Col>

                        <Col md={6}>
                            <motion.img
                                src="/images/staff.jpg"
                                alt="Hospital"
                                className="img-fluid rounded shadow"
                                variants={fadeInUp}
                                initial="hidden"
                                animate="visible"
                                transition={{ duration: 1.2 }}
                            />
                        </Col>
                    </Row>
                </Container>
            </div>

            <section id="about" style={{ padding: "60px 0", backgroundColor: "#ffffff" }}>
                <Container>
                    <Row className="align-items-center">
                        <Col md={6} className="mb-4 mb-md-0">
                            <motion.div
                                variants={fadeInUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                transition={{ duration: 0.7 }}
                            >
                                <Image src="/images/tech.jpg" alt="About Us" fluid rounded />
                            </motion.div>
                        </Col>

                        <Col md={6}>
                            <motion.h2
                                className="mb-4"
                                style={{ color: "#338dd7" }}
                                variants={fadeInUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                transition={{ duration: 0.7 }}
                            >
                                About Us
                            </motion.h2>

                            <motion.p
                                style={{ fontSize: "1.1rem", lineHeight: "1.6", color: "#6c757d" }}
                                variants={fadeInUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                transition={{ duration: 0.9 }}
                            >
                                Welcome to <strong>Our Hospital</strong>, where patient care comes first.
                                We are dedicated to delivering world-class healthcare with compassion
                                and innovation. Our experienced team of doctors, nurses, and staff
                                work around the clock to provide the highest quality medical services.
                            </motion.p>

                            <motion.p
                                style={{ fontSize: "1.1rem", lineHeight: "1.6", color: "#6c757d" }}
                                variants={fadeInUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                transition={{ duration: 1.1 }}
                            >
                                With state-of-the-art facilities and a patient-centered approach, we
                                strive to make every experience comfortable, safe, and effective.
                                Your health is our priority.
                            </motion.p>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section style={{ padding: "60px 0", backgroundColor: '#f8f9fa' }}>
                <Container>
                    <h2 className="text-center mb-5" style={{ color: "#338dd7" }}>Our Services</h2>
                    <Row>
                        {services.map((service, index) => (
                            <Col md={4} sm={6} xs={12} key={index} className="mb-4">
                                <motion.div
                                    variants={fadeInUp}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 + index * 0.2 }}
                                >
                                    <Card className="service-card">
                                        <Card.Img
                                            variant="top"
                                            src={service.img}
                                            alt={service.title}
                                            style={{ height: "200px", objectFit: "cover" }}
                                        />
                                        
                                        <Card.Body>
                                            <Card.Title style={{ color: "#338dd7" }}>{service.title}</Card.Title>
                                            <Card.Text style={{ color: "#6c757d" }}>{service.description}</Card.Text>
                                        </Card.Body>
                                    </Card>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            <section className="py-5" style={{ backgroundColor: "#ffffff" }}>
                <Container>
                    <h2 className="text-center mb-4" style={{ color: "#338dd7" }}>Why Choose Us ?</h2>
                    <Row>
                        {reasons.map((reason, index) => (
                            <Col md={3} sm={6} key={index} className="mb-4">
                                <motion.div
                                    variants={fadeInUp}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 + index * 0.2 }}
                                >
                                    <Card className="reason-card text-center p-3">
                                        <div className="icon mb-3 text-primary">{reason.icon}</div>
                                        <h5 style={{ color: "#338dd7" }}>{reason.title}</h5>
                                        <p className="text-muted">{reason.text}</p>
                                    </Card>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>
        </>
    );
};

export default HomePage;