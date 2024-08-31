import axios from "axios";

export const api = axios.create({
    baseURL : "http://localhost:8080/dashboard/categories"
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

export async function addCategory(nameCategory, photo){
    const formData = new FormData()
    formData.append("nameCategory", nameCategory)
    formData.append("photo", photo)

    const response = await api.post("/add/new-category", formData)
    if(response.status === 201){
        return true
    } else {
        return false
    }
}


export async function getAllCategores(){
    try{
        const result = await api.get("/all-categories")
        return result.data
    }catch(error){
        throw new Error("Error fetching categories")
    }
}

export async function getCategoryTypes(){
    try{
        const response = await api.get("/category/types")
        return response.data
    }catch(error){
        throw new Error("Error fetching category types")
    }
}

export async function deleteCategory(categoryId){
    try{
        const result = await api.delete(`/delete/category/${categoryId}`)
        return result.data
    }catch(error){
        throw new Error(`Error deleting category ${error.message}`)
    }
}

export async function updateCategory(categoryId, categoryData){
    const formData = new FormData()
    formData.append("imageCategory", categoryData.imageCategory)
    formData.append("nameCategory", categoryData.nameCategory)
    const response = await api.put(`/update/${categoryId}`, formData)
    return response
}

export async function getCategoryById(categoryId){
    try{
        const result = await api.get(`/category/${categoryId}`)
        return result.data
    }catch(error){
        throw new Error(`Error fetching category ${error.message}`)
    }
}

export async function CountCategory(){
    try{
        const result = await api.get("/category/count")
        return result.data
    }catch(error){
        throw new Error(`Error category ${error.message}`)
    }
}