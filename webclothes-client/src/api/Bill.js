import axios from "axios";

export const api = axios.create({
    baseURL : "http://localhost:8080/api/bill"
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
export async function getBill(orderId) {
    try {
        const result = await api.get(`/export/${orderId}`, {
            responseType: 'blob'
        });

        return result;
    } catch (error) {
        throw new Error("Error fetching order");
    }
}
