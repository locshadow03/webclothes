import axios from "axios";

export const api = axios.create({
    baseURL : "http://localhost:8080/comment"
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


export async function addComment(commentData){
     try {
    const response = await api.post("/new_comment", commentData);

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Thêm comment thất bại");
    }
  } catch (error) {
    console.error("Lỗi khi thêm comment:", error);
    throw error;
  }
}

export async function getCommentsByProductId(productId){
    try{
             const result = await api.get(`/product/${productId}`)
            return result.data
        }catch(error){
            throw new Error("Error fetching cartItems")
        }
}
