import axios from "axios";
import { API_BASE_URL } from "../utils/api.js";

const API = axios.create({
    baseURL: API_BASE_URL
});

const getToken = () => localStorage.getItem("adminToken");

const getConfig = () => ({
    headers: {
        Authorization: `Bearer ${getToken()}`
    }
});

export const getAdminProfile = async () => {
    const { data } = await API.get("/admin/profile", getConfig());
    return data;
};


export const getAdminStats = async () => {
    const { data } = await API.get("/admin/stats", getConfig());
    return data;
};


export const getAllDoctors = async () => {
    const { data } = await API.get("/admin/doctors", getConfig());
    return data;
};


export const deleteDoctor = async (doctorId) => {
    const { data } = await API.delete(`/admin/doctors/${doctorId}`, getConfig());
    return data;
};


export const addDoctor = async (doctorData) => {
    const { data } = await API.post("/admin/doctor/register", doctorData, getConfig());
    return data;
};


export const updateDoctor = async (doctorId, updatedData) => {
    const { data } = await API.put(`/admin/doctors/${doctorId}`, updatedData, getConfig());
    return data;
};


export const getAllPatients = async (params = {}) => {
    const { data } = await API.get("/admin/patients", {
        params,
        ...getConfig()
    });
    return data;
};


export const deletePatient = async (patientId) => {
    const { data } = await API.delete(`/admin/patients/${patientId}`, getConfig());
    return data;
};


export const getAllAppointments = async (params = {}) => {
    const { data } = await API.get("/admin/appointments", {
        params,
        ...getConfig()
    });
    return data;
};


export const updateAppointmentStatus = async (appointmentId, status) => {
    const { data } = await API.patch(
        `/admin/appointments/${appointmentId}/status`,
        { status },
        getConfig()
    );
    return data;
};


export const getAllPublicContacts = async () => {
    const { data } = await API.get("/admin/contacts/public", getConfig());
    return data;
};


export const deletePublicContact = async (id) => {
    const { data } = await API.delete(`/admin/contacts/public/${id}`, getConfig());
    return data;
};


export const getAllPatientContacts = async () => {
    const { data } = await API.get("/admin/contacts/patient", getConfig());
    return data;
};


export const deletePatientContact = async (id) => {
    const { data } = await API.delete(`/admin/contacts/patient/${id}`, getConfig());
    return data;
};