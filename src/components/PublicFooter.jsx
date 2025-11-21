import { Col, Container, Row } from "react-bootstrap";
import { FaEnvelope, FaFacebook, FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";

const PublicFooter = () => {

    return (
        <footer style={{ backgroundColor: "#338dd7ff", color: "white", padding: "30px 0" }}>
            <Container>
                <Row>
                    <Col md={4} sm={12} className="mb-3 mb-md-0">
                        <h5 className="fw-bold">Madhuram Hospital</h5>
                        <p>
                            Providing high-quality healthcare services with advanced technology and expert doctors.
                            Your health is our priority.
                        </p>
                    </Col>

                    <Col md={4} sm={12} className="mb-3 mb-md-0">
                        <h5 className="fw-bold">Quick Links</h5>
                        <ul className="list-unstyled">
                            <li><Link to="/" className="footer-link">Home</Link></li>
                            <li><Link to="/doctors" className="footer-link">Doctors</Link></li>
                            <li><Link to="/contact" className="footer-link">Contact</Link></li>
                        </ul>
                    </Col>

                    <Col md={4} sm={12}>
                        <h5 className="fw-bold">Contact Us</h5>
                        <p><FaMapMarkerAlt className="me-1" /> Madhuram Hospital Railway Station Road, Halvad, Gujarat, India </p>
                        <p><FaPhoneAlt className="me-1" /><a href="tel:+919510608821" className="footer-link"> +91 9510608821 </a></p>
                        <p><FaEnvelope className="me-1" /><a href="mailto:panchaldeep536@gmail.com" className="footer-link"> panchaldeep536@gmail.com </a></p>

                        <div>
                            <a href="#" target="_blank" rel="noopener noreferrer" className="footer-link me-3"><FaFacebook size={20} /></a>
                            <a href="#" target="_blank" rel="noopener noreferrer" className="footer-link me-3"><FaTwitter size={20} /></a>
                            <a href="https://www.instagram.com/_deep_1411/" target="_blank" rel="noopener noreferrer" className="footer-link"><FaInstagram size={20} /></a>
                        </div>
                    </Col>
                </Row>

                <hr style={{ borderColor: "rgba(27, 4, 4, 1)" }} />
                <p className="text-center mb-0">
                    © {new Date().getFullYear()} Madhuram Hospital. All rights reserved.
                </p>
            </Container>
        </footer>
    );
};

export default PublicFooter;