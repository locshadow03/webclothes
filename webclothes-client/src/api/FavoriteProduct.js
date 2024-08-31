import axios from "axios";

export const api = axios.create({
    baseURL : "http://localhost:8080/home/favorites"
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


export async function addFavoriteProduct(userId, productId){
    try{
        const result = await api.post(`/${userId}/${productId}`)
        return result.data
    }catch(error){
        throw new Error(`Error fetching product ${error.message}`)
    }
}


export async function getAllFavorites(userId){
    try{
        const result = await api.get(`/${userId}`)
        return result.data
    }catch(error){
        throw new Error("Error fetching products")
    }
}

export async function removeFavoriteProduct(userId, productId){
    try{
        const result = await api.delete(`/${userId}/${productId}`)
        return result.data
    }catch(error){
        throw new Error(`Error deleting product ${error.message}`)
    }
}

export async function getTopFavoriteProductToday(){
    try{
        const result = await api.get("/top_favorite_product/today")
        console.error(result.data)
        return result.data
    }catch(error){
        throw new Error("Error fetching top favorite product today")
    }
}

export async function getTopFavoriteProductMonth(){
    try{
        const result = await api.get("/top_favorite_product/month")
        console.error(result.data)
        return result.data
    }catch(error){
        throw new Error("Error fetching top favorite product month")
    }
}

export async function getTopFavoriteProductYear(){
    try{
        const result = await api.get("/top_favorite_product/year")
        console.log("Favorite product top 5: ",result.data)
        return result.data
    }catch(error){
        throw new Error("Error fetching top favorite product year")
    }
}

export async function getTopFavoriteProductAll(){
    try{
        const result = await api.get("/top_favorite_product")
        console.error(result.data)
        return result.data
    }catch(error){
        throw new Error("Error fetching top favorite product all")
    }
}