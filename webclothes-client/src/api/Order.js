import axios from "axios";

export const api = axios.create({
    baseURL : "http://localhost:8080/order"
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

export async function addOrder(orderData){
    console.log("Sending order data:", JSON.stringify(orderData, null, 2));
    const response = await api.post("/add-order", orderData)
    if(response !== null){
        return true
    } else {
        return false
    }
}

export async function getAllOrders(){
    try{
        const result = await api.get("/all-order")
        console.error(result.data)
        return result.data
    }catch(error){
        throw new Error("Error fetching orders")
    }
}

export async function updateStatusOrder(orderId,status){
    const formData = new FormData()
    formData.append("status", status)
    const response = await api.put(`/update-status/${orderId}`, formData)
    return response
}

export async function getDetailById(orderId){
    try {
        const response = await api.get(`/${orderId}`);
        console.error(response.data)
        return response.data;
    } catch (error) {
        console.error("Error fetching order details:", error);
        throw error;
    }
};

export async function deleteOrder(orderId){
    try{
        const result = await api.delete(`/delete/${orderId}`)
        return result.data
    }catch(error){
        throw new Error(`Error deleting order ${error.message}`)
    }
}


export async function getAllOrdersByCustomer(customerId){
    try{
        const result = await api.get(`/customer/${customerId}`)
        console.error(result.data)
        return result.data
    }catch(error){
        throw new Error("Error fetching orders")
    }
}

export async function getCountOrders(){
    try{
        const result = await api.get("/count_order")
        console.error(result.data)
        return result.data
    }catch(error){
        throw new Error("Error fetching count orders")
    }
}

export async function getTotalAmount(){
    try{
        const result = await api.get("/total_amount")
        console.error(result.data)
        return result.data
    }catch(error){
        throw new Error("Error fetching total amount orders")
    }
}

export async function getTopCustomerToDay(){
    try{
        const result = await api.get("/top-customers/today")
        console.error(result.data)
        return result.data
    }catch(error){
        throw new Error("Error fetching top customer today")
    }
}

export async function getTopCustomerMonth(){
    try{
        const result = await api.get("/top-customers/month")
        console.error(result.data)
        return result.data
    }catch(error){
        throw new Error("Error fetching top customer month")
    }
}

export async function getTopCustomerYear(){
    try{
        const result = await api.get("/top-customers/year")
        console.error(result.data)
        return result.data
    }catch(error){
        throw new Error("Error fetching top customer year")
    }
}

export async function getTopCustomerAll(){
    try{
        const result = await api.get("/top-customers")
        console.error(result.data)
        return result.data
    }catch(error){
        throw new Error("Error fetching top customer all day")
    }
}

export async function getTopProductOrderToday(){
    try{
        const result = await api.get("/top-products/today")
        console.error(result.data)
        return result.data
    }catch(error){
        throw new Error("Error fetching top product today")
    }
}

export async function getTopProductOrderMonth(){
    try{
        const result = await api.get("/top-products/month")
        console.error(result.data)
        return result.data
    }catch(error){
        throw new Error("Error fetching top product month")
    }
}

export async function getTopProductOrderYear(){
    try{
        const result = await api.get("/top-products/year")
        console.error(result.data)
        return result.data
    }catch(error){
        throw new Error("Error fetching top product year")
    }
}

export async function getTopProductOrderAll(){
    try{
        const result = await api.get("/top-products")
        console.error(result.data)
        return result.data
    }catch(error){
        throw new Error("Error fetching top product all")
    }
}

export async function getTotalAmountForYear(year) {
    try {
        const result = await api.get("/chart", {
            params: {
                year: year
            }
        });
        console.log(result.data);
        return result.data;
    } catch (error) {
        throw new Error("Error fetching order year");
    }
}
