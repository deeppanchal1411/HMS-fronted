import { Spinner, Row, Col } from "react-bootstrap";

const LoadingSpinner = ({ message = "Loading...", variant = "primary", size = "md", fullscreen = false }) => {
  return (
    <Row
      className={`justify-content-center align-items-center ${fullscreen ? "vh-100" : "my-5"}`}
      style={fullscreen ? { minHeight: "50vh" } : {}}
    >
      <Col xs="auto" className="text-center">
        <Spinner
          animation="border"
          role="status"
          variant={variant}
          style={{
            width: size === "sm" ? "2rem" : size === "lg" ? "4rem" : "3rem",
            height: size === "sm" ? "2rem" : size === "lg" ? "4rem" : "3rem",
          }}
        />
        <div className="mt-3 fw-semibold text-secondary" style={{ fontSize: "1.1rem" }}>
          {message}
        </div>
      </Col>
    </Row>
  );
};

export default LoadingSpinner;