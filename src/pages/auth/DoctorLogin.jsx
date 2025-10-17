import LoginForm from "../../components/LoginForm";

const DoctorLogin = () => {
    return (
        <LoginForm
            userType="Doctor"
            apiEndpoint="/doctor/login"
            tokenKey="doctorToken"
            redirectPath="/doctor/dashboard"
        />
    );
};

export default DoctorLogin;