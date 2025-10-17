import LoginForm from "../../components/LoginForm";

const AdminLogin = () => {
    return (
        <LoginForm
            userType="Admin"
            apiEndpoint="/admin/login"
            tokenKey="adminToken"
            redirectPath="/admin/dashboard"
        />
    );
};

export default AdminLogin;