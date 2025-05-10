import axios from "axios";

export const api = axios.create({
    baseURL : "http://localhost:8080/wallet"
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

export async function getWallet(userId){
    try{
        const result = await api.get(`/${userId}`)

        console.log("Vis tooi : ", result)
        return result.data
    }catch(error){
        throw new Error("Error fetching wallet")
    }
}