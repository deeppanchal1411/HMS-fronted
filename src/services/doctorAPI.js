import axios from "axios";
import { API_BASE_URL } from "../utils/api.js";

const API = axios.create({
  baseURL: API_BASE_URL,
});

const getToken = () => localStorage.getItem("doctorToken");

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});


export const getDoctorProfile = async () => {
  const { data } = await API.get("/doctor/profile", getConfig());
  return data;
};


export const updateDoctorPassword = async (passwordData) => {
  const { data } = await API.put("/doctor/update-password", passwordData, getConfig());
  return data;
};


export const updateDoctorProfile = async (profileData) => {
  const { data } = await API.put("/doctor/profile", profileData, getConfig());
  return data;
};


export const getDoctorDashboard = async () => {
  const { data } = await API.get("/doctor/dashboard", getConfig());
  return data;
};


export const getDoctorAppointments = async (filters = {}) => {
  const { data } = await API.get("/doctor/appointments", {
    ...getConfig(),
    params: filters
  });
  return data.appointments;
};


export const updateDoctorAppointmentStatus = async (id, status) => {
  const { data } = await API.patch(
    `/doctor/appointments/${id}/status`,
    { status },
    getConfig()
  );
  return data;
};


export const getDoctorPatients = async () => {
  const { data } = await API.get("/doctor/patients", getConfig());
  return data;
};


export const getDoctorAvailability = async () => {
  const { data } = await API.get("/doctor/availability", getConfig());
  return data.availability;
};


export const updateDoctorAvailability = async (availability) => {
  const { data } = await API.put("/doctor/availability", { availability }, getConfig());
  return data;
};