import axios from "axios";

export const api = axios.create({
    baseURL : "http://localhost:8080/home/cart"
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


export async function addCartItem(cartId,productId, quantity, size){
    const formData = new FormData()
    formData.append("productId", productId)
    formData.append("quantity", quantity)
    formData.append("size", size)

    const response = await api.post(`/${cartId}/add`, formData)
    if(response.status === 201){
        return true
    } else {
        return false
    }
}

export async function updateCartItem(cartId,cartItemId, quantity, size){
    const formData = new FormData()
    formData.append("quantity", quantity)
    formData.append("size", size)

    await api.put(`/${cartId}/update/${cartItemId}`, formData)
}

export async function getAllCartItems(cartId){
    try{
        const result = await api.get(`/${cartId}`)
        return result.data
    }catch(error){
        throw new Error("Error fetching cartItems")
    }
}

export async function deleteCartItem(cartId, cartItemId){
    try{
        const result = await api.delete(`/${cartId}/remove/${cartItemId}`)
        return result.data
    }catch(error){
        throw new Error(`Error deleting cartItem ${error.message}`)
    }
}