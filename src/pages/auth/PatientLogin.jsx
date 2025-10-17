import LoginForm from "../../components/LoginForm"

const PatientLogin = () => {
    return (
        <LoginForm
            userType="Patient"
            apiEndpoint="/patients/login"
            tokenKey="patientToken"
            redirectPath="/patient/dashboard"
        />
    );
};

export default PatientLogin;