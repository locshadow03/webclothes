import axios from "axios";

export const api = axios.create({
    baseURL : "http://localhost:8080/payment/vnpay"
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

export async function createPayment(orderCode, amount){
    const formData = new FormData()
    formData.append("orderCode", orderCode)
    formData.append("amount", amount)
    const response = await api.post("/create", formData)

    return response.data
}

export async function getResultPayment(query){
    const response = await api.get("/result", query)
    return response
}