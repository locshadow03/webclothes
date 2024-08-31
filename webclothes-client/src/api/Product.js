import axios from "axios";

export const api = axios.create({
    baseURL : "http://localhost:8080/dashboard/products"
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

export async function addProduct(nameProduct,codeProduct,nameCategory, description,price,sizeQuantities,nameBrand, disCount, photo){
    const formData = new FormData()
    formData.append("nameProduct", nameProduct)
    formData.append("codeProduct", codeProduct)
    formData.append("nameCategory", nameCategory)
    formData.append("description", description)
    formData.append("price", price)
    formData.append("sizeQuantities", JSON.stringify(sizeQuantities))
    formData.append("nameBrand", nameBrand)
    formData.append("disCount", disCount)
    formData.append("photo", photo)

    const response = await api.post("/add/new-product", formData)
    if(response.status === 201){
        return true
    } else {
        return false
    }
}

export async function getAllProducts(){
    try{
        const result = await api.get("/all-products")
        return result.data
    }catch(error){
        throw new Error("Error fetching products")
    }
}

export async function updateProduct(productId,productData){
    const formData = new FormData()
    formData.append("nameProduct", productData.name)
    formData.append("codeProduct", productData.code)
    formData.append("nameCategory", productData.nameCategory)
    formData.append("description", productData.description)
    formData.append("price", productData.price)
    formData.append("sizeQuantities", JSON.stringify(productData.sizeQuantities))
    formData.append("nameBrand", productData.nameBrand)
    formData.append("disCount", productData.disCount)
    formData.append("imageProduct", productData.imageProduct)
    const response = await api.put(`/update/${productId}`, formData)
    return response
}

export async function deleteProduct(productId){
    try{
        const result = await api.delete(`/delete/product/${productId}`)
        return result.data
    }catch(error){
        throw new Error(`Error deleting product ${error.message}`)
    }
}

export async function getProductById(productId){
    try{
        const result = await api.get(`/product/${productId}`)
        return result.data
    }catch(error){
        throw new Error(`Error fetching product ${error.message}`)
    }
}

export async function getAllSearchProduct(search){
    try{
        const result = await api.get('/search', {
            params: {
                search: search
            }
        })
        return result.data
    }catch(error){
        throw new Error(`Error fetching product ${error.message}`)
    }
}