import { Navbar, Container, Nav, Dropdown, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AdminNavbar = ({ user }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out of your account.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, logout"
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("adminToken");
                Swal.fire("Logged out!", "You have been logged out successfully.", "success");
                navigate("/");
            }
        });
    };

    return (
        <>
            <Navbar expand="lg" className="shadow-sm py-2" style={{ backgroundColor: "#338dd7ff" }}>
                <Container fluid>

                    <Navbar.Brand
                        className="d-flex fs-4 align-items-center gap-2 fw-bold"
                        role="button"
                        onClick={() => navigate("/admin/dashboard")}
                    >
                        <img
                            src="/images/hospital.png"
                            alt="Logo"
                            width="40"
                            height="40"
                            className="d-inline-block align-top"
                        />
                        Madhuram Hospital (Admin)
                    </Navbar.Brand>

                    <Nav className="ms-auto align-items-center gap-3">
                        <Dropdown align="end">
                            <Dropdown.Toggle variant="light" className="d-flex align-items-center border-0 bg-transparent">
                                <Image
                                    src="/images/avatar.png"
                                    roundedCircle
                                    width="35"
                                    height="35"
                                    className="me-2"
                                />
                                <span>{user?.name || "Admin"}</span>
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item className="dropdown-hover" onClick={handleLogout}>Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav>
                </Container>
            </Navbar>
        </>
    );
};

export default AdminNavbar;