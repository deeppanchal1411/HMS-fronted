import axios from "axios";
import { API_BASE_URL } from "../utils/api.js";

const API = axios.create({
    baseURL: API_BASE_URL
});

const getToken = () => localStorage.getItem("patientToken");

const getConfig = () => ({
    headers: {
        Authorization: `Bearer ${getToken()}`
    }
});

export const getPatientProfile = async () => {
   const { data } = await API.get("/patients/profile", getConfig());
   return data;
};


export const getUpcomingAppointment = async () => {
  try {
    const { data } = await API.get("/appointments/recent", getConfig());
    return data;
  } catch (err) {
    if (err.response?.status === 404) return null;
    throw err;
  }
};


export const getPatientAppointments = async (filters = {}) => {
  const { data } = await API.get("/appointments/my-appointments", {
    ...getConfig(),
    params: filters
  });
  return data.appointments;
};


export const bookNewAppointment = async (appointmentData) => {
  const { data } = await API.post("/appointments", appointmentData, getConfig());
  return data;
};


export const getDoctorsList = async () => {
  const { data } = await API.get("/patients/doctors", getConfig());
  return data;
};


export const cancelAppointment = async (appointmentId) => {
  const { data } = await API.put(`/appointments/cancel/${appointmentId}`, {}, getConfig());
  return data;
};