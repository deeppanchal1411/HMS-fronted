import { Link } from "react-router-dom";

function ErrorPage() {
    return (
        <div style={{
            textAlign: "center",
            padding: "80px 20px",
        }}>
            <h1 style={{ fontSize: "5rem", color: "#e74c3c" }}>404</h1>
            <h2>Oops! Page not found</h2>
            <p>The page you’re looking for doesn’t exist or has been moved.</p>
            <Link
                to="/"
                style={{
                    display: "inline-block",
                    marginTop: "20px",
                    padding: "10px 20px",
                    backgroundColor: "#3498db",
                    color: "#fff",
                    borderRadius: "5px",
                    textDecoration: "none",
                }}
            >
                Go Home
            </Link>
        </div>
    );
};

export default ErrorPage;