import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:8080/dashboard/users',
    headers: {
        'Content-Type': 'application/json',
    }
});

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

const api1 = axios.create({
    baseURL: 'http://localhost:8080/dashboard/users',
});

api1.interceptors.request.use(
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

export async function getAllUsers(){
    try{
        const result = await api.get("/allUsers")
        console.error("ERROR user hihi", result.data)
        return result.data
    }catch(error){
        throw new Error("Error fetching users")
    }
}

export async function getUserById(userId){
    try{
        const result = await api.get(`/user/${userId}`)
        return result.data
    }catch(error){
        throw new Error(`Error fetching user ${error.message}`)
    }
}

export async function updateRole(userId,role){
    const formData = new FormData()
    formData.append("role", role)
    const response = await api1.post(`/update/user/${userId}`, formData)
    return response
}

export async function getTotalUser(){
    try{
        const result = await api1.get("/total_user")
        console.error(result.data)
        return result.data
    }catch(error){
        throw new Error("Error fetching total amount users")
    }
}