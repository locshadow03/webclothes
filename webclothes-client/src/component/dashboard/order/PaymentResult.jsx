// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useLocation } from "react-router-dom";
// import { toast } from "react-toastify";
// import { addOrder } from "../api/orderApi"; // đường dẫn tới hàm gọi BE của bạn
// import { getResultPayment, ResultPayment } from "../../../api/PayMent";
// import { deleteCartItem } from "../../../api/Cart";

// const PaymentResult = () => {
//   const [result, setResult] = useState(null);
//   const location = useLocation();
//   const[errorMessage, setErrorMessage] = useState("")

//   const handleDelete = async(cartId, cartItemId) =>{
//           try{
//               const result = await deleteCartItem(cartId, cartItemId)
//               if(result === ""){
//                   fetchCartItems()
//               } else{
//                   console.error(`Error deleting product: ${result.message}`)
//               }
//           }catch(error){
//               setErrorMessage(error.message)
//           }
//     }
    

//   useEffect(() => {
//     const fetchResult = async () => {
//       const query = location.search; // ?vnp_ResponseCode=00&...

//       try {
//         const response = await getResultPayment(query)
//         setResult(response.data);

//         if (response.data.status === "success") {
//           const orderData = JSON.parse(localStorage.getItem("pendingOrder"));
//           const cartItems = orderData.items;

//           const orderResult = await addOrder(orderData);
//           if (orderResult) {
//             toast.success("Đặt hàng thành công sau khi thanh toán!");

//             for (const item of cartItems) {
//               await handleDelete(localStorage.getItem("cartId"), item.cartId);
//             }

//             localStorage.removeItem("pendingOrder");
//           }
//         }
//       } catch (error) {
//         console.error("Lỗi xử lý kết quả thanh toán:", error);
//         setResult({ status: "error", message: "Lỗi xử lý thanh toán" });
//       }
//     };

//     fetchResult();
//   }, [location]);

//   if (!result) return <p>Đang xử lý thanh toán...</p>;

//   return (
//     <div className="container mt-4">
//       <h2>Kết quả thanh toán:</h2>
//       <p><strong>Trạng thái:</strong> {result.status}</p>
//       <p><strong>Thông báo:</strong> {result.message}</p>
//       {result.orderCode && <p><strong>Mã đơn hàng:</strong> {result.orderCode}</p>}
//     </div>
//   );
// };

// export default PaymentResult;
