import { Outlet } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";

const PublicRoute = () => {
    return (
        <div className="layout">
            <PublicNavbar />
            <main className="content">
                <Outlet />
            </main>
            <PublicFooter />
        </div>
    );
};

export default PublicRoute;