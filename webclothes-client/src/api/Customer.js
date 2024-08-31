import axios from "axios";

export const api = axios.create({
    baseURL : "http://localhost:8080/customers"
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

export async function getCustomerById(userId){
    try{
        const result = await api.get(`/${userId}`)
        return result.data
    }catch(error){
        throw new Error(`Error fetching user ${error.message}`)
    }
}

export async function updateCustomer(id, customerUpdate){
    const formData = new FormData()
    formData.append("firstName", customerUpdate.firstName)
    formData.append("lastName", customerUpdate.lastName)
    formData.append("phoneNumber", customerUpdate.phoneNumber)
    formData.append("address", customerUpdate.address)
    formData.append("avatar", customerUpdate.avatar)

    const response = await api.put(`/update/${id}`, formData)
    if(response.status === 201){
        return true
    } else {
        return false
    }
}
