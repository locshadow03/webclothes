import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:8080', // Thay đổi theo base URL của bạn
    headers: {
        'Content-Type': 'application/json',
    }
});

export async function login(userData){
    try{
        const response = await api.post("/auth/login", userData)
        if (response.status === 200) {
            
            const { token, username, id } = response.data;
            localStorage.setItem("token", token);
            localStorage.setItem("username", username);
            localStorage.setItem("id", id);
            

            const responseCart = await createCart(id, token);
            localStorage.setItem("cartId", responseCart.cartId);
            return response.data;
        }

    }catch(err){
        throw err;
    }
}

export async function logout() {
    try {
        const response = await api.post("/auth/logout");
        if (response.status === 200) {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("username");
            localStorage.removeItem("id");
            localStorage.removeItem("cartId");
            

        }
    } catch (error) {
        console.error('Error in logout API:', error);
        throw error; 
    }
}

export async function register(userData){
    try{
        const response = await api.post("/auth/register", userData)
        return response.data;
    }catch(error){
        console.error('Error in register API:', error);
        throw error; 
    }
}

export async function createCart(userId, token) {
    try {
        const response = await api.post('/home/cart/create', {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                userId: userId // Gửi userId như tham số query nếu cần
            }
        });
        localStorage.setItem("cartId", response.cartId);
        return response.data;
    } catch (error) {
        console.error('Error creating cart:', error);
        throw error;
    }
}