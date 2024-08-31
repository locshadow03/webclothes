import axios from "axios";

export const api = axios.create({
    baseURL : "http://localhost:8080/dashboard/brands"
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

export async function addBrand(nameBrand, photo){
    const formData = new FormData()
    formData.append("nameBrand", nameBrand)
    formData.append("photoBrand", photo)

    const response = await api.post("/add/new-brand", formData)
    if(response.status === 201){
        return true
    } else {
        return false
    }
}


export async function getAllBrands(){
    try{
        const result = await api.get("/all-brands")
        return result.data
    }catch(error){
        throw new Error("Error fetching brands")
    }
}

export async function deleteBrand(brandId){
    try{
        const result = await api.delete(`/delete/brand/${brandId}`)
        return result.data
    }catch(error){
        throw new Error(`Error deleting brand ${error.message}`)
    }
}

export async function updateBrand(brandId, brandData){
    const formData = new FormData()
    formData.append("imageBrand", brandData.imageBrand)
    formData.append("nameBrand", brandData.nameBrand)
    const response = await api.put(`/update/${brandId}`, formData)
    return response
}

export async function getBrandById(brandId){
    try{
        const result = await api.get(`/brand/${brandId}`)
        return result.data
    }catch(error){
        throw new Error(`Error fetching brand ${error.message}`)
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

export async function getBrandTypes(){
    try{
        const response = await api.get("/brand/types")
        return response.data
    }catch(error){
        throw new Error("Error fetching brand types")
    }
}

export async function CountBrand(){
    try{
        const result = await api.get("/brand/count")
        return result.data
    }catch(error){
        throw new Error(`Error brand ${error.message}`)
    }
}