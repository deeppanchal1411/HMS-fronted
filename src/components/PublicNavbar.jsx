import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { useNavigate, NavLink, Link } from 'react-router-dom';

const loginRoutes = [
    { label: 'Patient', path: '/patient/login' },
    { label: 'Doctor', path: '/doctor/login' },
    { label: 'Admin', path: '/admin/login' }
];

const PublicNavbar = () => {
    const navigate = useNavigate();

    const getLinkClass = ({ isActive }) =>
        `nav-link fw-medium ${isActive ? 'text-white border-bottom border-white' : 'text-light'}`;

    return (
        <Navbar expand="lg" className="shadow-sm" style={{ backgroundColor: "#338dd7ff" }}>
            <Container>
                <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-white mb-0">
                    <img
                        src="/images/hospital.png"
                        alt="Madhuram Hospital Logo"
                        style={{ height: "60px", marginRight: "10px" }}
                    />
                    <span className="d-none d-md-inline text-white">Madhuram Hospital</span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="navbar" />

                <Navbar.Collapse id="navbar">
                    <Nav className="ms-auto align-items-center gap-3">
                        <NavLink to="/" className={getLinkClass}>
                            Home
                        </NavLink>

                        <NavLink to="/doctors" className={getLinkClass}>
                            Doctors
                        </NavLink>  

                        <NavLink to="/contact" className={getLinkClass}>
                            Contact
                        </NavLink>

                        <Dropdown align="end">
                            <Dropdown.Toggle variant="white" className="text-dark fw-medium border-0" aria-label="Login options">
                                Login
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {loginRoutes.map(({ label, path }) => (
                                    <Dropdown.Item
                                        key={label}
                                        className="dropdown-hover"
                                        onClick={() => navigate(path)}
                                    >
                                        {label}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>

                        <Button
                            variant="primary"
                            className="rounded-pill px-4 fw-semibold"
                            onClick={() => navigate('/patient/register')}
                            aria-label="Register as patient"
                        >
                            Register
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default PublicNavbar;