import axios from "axios";

export const api = axios.create({
    baseURL : "http://localhost:8080/event"
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

export async function addDiscountEvent(nameEvent, descriptionEvent, startDate, endDate, discountAmount, isPercentage, brandIds, categoryIds, productIds, image
  ) {
    const formData = new FormData();
    formData.append("name_event", nameEvent);
    formData.append("description_event", descriptionEvent);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("discountAmount", discountAmount);
    formData.append("isPercentage", isPercentage);
    formData.append("brand_id", JSON.stringify(brandIds));
    formData.append("category_id", JSON.stringify(categoryIds));
    formData.append("product_id", JSON.stringify(productIds));
    if (image) {
      formData.append("imageEvent", image);
    }

    console.log(formData.get("category_id"));
  
    try {
      const response = await api.post("/create/discount-event", formData);

      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi thêm sự kiện:", error);
      return false;
    }
}

export async function getAllEvents(){
    try{
        const result = await api.get("/all-events")
        console.log(result)
        return result.data
    }catch(error){
        throw new Error("Error fetching events")
    }
}

export async function getEventById(eventId){
    try{
        const result = await api.get(`/view_event/${eventId}`)
        console.log('hello', result.data)
        return result.data
    }catch(error){
        throw new Error(`Error fetching event ${error.message}`)
    }
}

export async function updateEvent(id, formDataToSend
) {

  try {
    const response = await api.put(`/update_event/${id}`, formDataToSend);

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật sự kiện:", error);
    return false;
  }
}