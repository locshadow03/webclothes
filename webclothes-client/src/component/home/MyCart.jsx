import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteCartItem, getAllCartItems, updateCartItem } from '../../api/Cart'
import { getCustomerById } from '../../api/Customer'
import { addOrder, getOrderCode } from '../../api/Order'
import { toast } from 'react-toastify'
import { createPayment } from '../../api/PayMent'
import { useLocation } from 'react-router-dom';

const MyCart = () => {
    const[cartItems, setCartItems] = useState([])
    const[selectedSize, setSelectedSize] = useState({});
    const[errorMessage, setErrorMessage] = useState("")
    const[quantities, setQuantities] = useState({})
    const[orderCode, setOrderCode] = useState("")
    
    const[totalMoney, setTotalMoney] = useState(0)
    const location = useLocation();

    const [paymentMethod, setPaymentMethod] = useState("COD");

    const [customer, setCustomer] = useState({
        customerId : "",
        firstName :"",
        lastName :"",
        phoneNumber : "",
        address : "",
        avatar : null
    })

    const userId = localStorage.getItem('id')
    const hasRun = useRef(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const responseCode = params.get("vnp_ResponseCode");
        console.log("Hien thi ra nay: ", JSON.parse(localStorage.getItem("pendingOrderData")))
        const orderData = JSON.parse(localStorage.getItem("pendingOrderData"));
        const cartData = JSON.parse(localStorage.getItem("cartData"));
        console.log("Order Data: ", cartData);
        if (hasRun.current) return;
        hasRun.current = true;
        if (responseCode === "00") {
            if (orderData && cartData) {
                const handlePaymentSuccess = async () => {
                    try {
                        setIsLoading(true);
                        const result = await addOrder(orderData);
                        if (result) {
                            
    
                            for (const item of cartData) {
                                await handleDelete(localStorage.getItem('cartId'), item.cartId);
                            }
    
                            localStorage.removeItem("pendingOrderData");
                        
                        }

                        setTimeout(() => {
                            setIsLoading(false);
                          }, 5000);
                          
                          toast.success("Thanh toán thành công và đơn hàng đã được tạo!");
                    } catch (error) {
                        console.error("Lỗi khi tạo đơn hàng sau thanh toán:", error);
                        toast.error("Đã có lỗi xảy ra khi xử lý đơn hàng.");
                    }
                };
    
                handlePaymentSuccess();

            }
        } else {
            fetchCartItems(); // Nếu không có thanh toán hoặc thanh toán thất bại
        }
    }, []);

    useEffect(() => {

        const fetchCustomer = async() =>{
            try {
                const customerData = await getCustomerById(userId);
                if (customerData) {
                    console.error("Error: ", customerData)
                    setCustomer(customerData);
                } else {
                    setCustomer({
                        customerId: "",
                        firstName: "",
                        lastName: "",
                        phoneNumber: "",
                        address: "",
                        avatar: null
                    });
                } 
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
        fetchCustomer();
    }, [userId]);


    const fetchCartItems = async () => {
        const cartId = localStorage.getItem('cartId');
        console.log("Cart ID:", cartId);
        try {
            const result = await getAllCartItems(cartId);
            console.log("Fetched result:", result); // Ghi log dữ liệu ngay khi nhận được
            setCartItems(result);
            console.log("Fetched result:", cartItems);
            const initialQuantities = {};
            result.forEach(item => {
                initialQuantities[item.cartId] = item.quantity;
            });
            setQuantities(initialQuantities);

            const total = result.reduce((sum, item) => {
                const discountedPrice = item.disCount ? (item.percentage
                ? item.price - (item.price * (item.disCount / 100))
                : item.price - item.disCount) : item.price
              
                return sum + (discountedPrice * item.quantity);
              }, 0);
              
              setTotalMoney(total);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const handlePayment = async (amount) => {

        const orderData = {
            customer: {
                id: customer.customerId,
                lastName: customer.lastName,
                firstName: customer.firstName,
                phoneNumber: customer.phoneNumber,
                address: customer.address
            },
            orderCode: orderCode,
            items: cartItems.map(item => ({
                product: { id: item.productId },
                quantity: item.quantity,
                size: item.size,
                price: item.price,
                color: item.color
            })),
            paymentMethod
        };

        localStorage.setItem("pendingOrderData", JSON.stringify(orderData))

        localStorage.setItem("cartData", JSON.stringify(cartItems))

        console.log("Order Data: ", orderData);
        try {
            // Gửi yêu cầu để lấy URL thanh toán từ backend
            const response = await createPayment(JSON.stringify(orderCode), amount)

            console.log("URL: ", response);

            window.location.href = response;
            
        } catch (error) {
            console.error('Có lỗi xảy ra khi tạo thanh toán:', error);
            const errorMessage = error.response?.data?.message || error.message;
            console.error("Error:", errorMessage);
            toast.error(errorMessage);
        }
    };

    const handleReload = () => {
        window.location.reload();
    };

    const fetchOrderCode = async () => {
        const result = await getOrderCode()
        setOrderCode(result)
    }

    

    useEffect(() => {
        fetchCartItems();
        fetchOrderCode();
        console.log("Updated cartItems:", cartItems);
    }, []);

    const decreaseQuantity = async (cartId, cartItemId, size) => {
        setQuantities(prevQuantities => {
            const newQuantities = { ...prevQuantities };
            if (newQuantities[cartItemId] > 1) {
                newQuantities[cartItemId] -= 1;
            }
            updateCartItem(cartId, cartItemId, newQuantities[cartItemId], size);
            return newQuantities;
        });
    };
    
    const increaseQuantity = async (cartId, cartItemId, size) => {
        setQuantities(prevQuantities => {
            const newQuantities = { ...prevQuantities };
            newQuantities[cartItemId] += 1;
            updateCartItem(cartId, cartItemId, newQuantities[cartItemId], size);
            return newQuantities;
        });
    };

    const handleDelete = async(cartId, cartItemId) =>{
        try{
            const result = await deleteCartItem(cartId, cartItemId)
            if(result === ""){
                fetchCartItems()
            } else{
                console.error(`Error deleting product: ${result.message}`)
            }
        }catch(error){
            setErrorMessage(error.message)
        }
    }
    const handleWallet = async () => {
        try {
            const orderData = {
                customer: {
                    id: customer.customerId,
                    lastName: customer.lastName,
                    firstName: customer.firstName,
                    phoneNumber: customer.phoneNumber,
                    address: customer.address
                },
                orderCode: orderCode,
                items: cartItems.map(item => ({
                    product: { id: item.productId },
                    quantity: item.quantity,
                    size: item.size,
                    price: item.price,
                    color: item.color
                })),
                paymentMethod
            };

            console.error("Error cartItems:", cartItems)

            console.error("Error order:", orderData)
            
            const result = await addOrder(orderData);
            if (result) {
                toast.success("Đơn hàng đặt thành công!");

                for (const item of cartItems) {
                    await handleDelete(localStorage.getItem('cartId'), item.cartId);
                }

            } else {
                console.error('Error creating order:', result.message);
                setErrorMessage(result.message);
            }
        } catch (error) {
            console.error('Error submitting order:', error);
            const errorMessage = error.response?.data?.message || error.message;
            console.error("Error:", errorMessage);
            toast.error(errorMessage);
        }
    }

    const handleSubmitOrder = async () => {
        try {

            const orderData = {
                customer: {
                    id: customer.customerId,
                    lastName: customer.lastName,
                    firstName: customer.firstName,
                    phoneNumber: customer.phoneNumber,
                    address: customer.address
                },
                orderCode: orderCode,
                items: cartItems.map(item => ({
                    product: { id: item.productId },
                    quantity: item.quantity,
                    size: item.size,
                    price: item.price,
                    color: item.color
                })),
                paymentMethod
            };

            console.error("Error cartItems:", cartItems)

            console.error("Error order:", orderData)
            
            const result = await addOrder(orderData);
            if (result) {
                toast.success("Đơn hàng đặt thành công!");

                for (const item of cartItems) {
                    await handleDelete(localStorage.getItem('cartId'), item.cartId);
                }

            } else {
                console.error('Error creating order:', result.message);
                setErrorMessage(result.message);
            }
        } catch (error) {
            console.error('Error submitting order:', error);
            const errorMessage = error.response?.data?.message || error.message;
            console.error("Error:", errorMessage);
            toast.error(errorMessage);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
          minimumFractionDigits: 0,
        }).format(value);
      };

      const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
  return (
    <>
        {isLoading && (
            <div className="fullscreen-spinner">
                <div className="spinner"></div>
            </div>
        )}


        <div className = "container-fluid mx-5 mt-4" style = {{borderBottom : "1px solid rgba(0, 0 , 0 ,0.2)"}}>
            <div className = 'mb-2'>
                <Link to = "/home" style = {{textDecoration:'none', color:'#808080'}}>Trang chủ &gt; </Link>
                <Link to = "/home" style = {{textDecoration:'none', color:'#808080'}}>Giỏ hàng của bạn</Link>
            </div>
        </div>

        <div className = "mx-5 pt-4">
        <div className = "row">
        <div className='col-12'>
            <table className='table table-hover table-condensed'>
                    <thead>
                        <tr className='text-center'>
                            <th style = {{color:'#808080', fontWeight: "none"}}>Sản phẩm</th>
                            <th style = {{color:'#808080', fontWeight: "none"}}></th>
                            <th style = {{color:'#808080', fontWeight: "none"}}>Kích thước</th>
                            <th style = {{color:'#808080', fontWeight: "none"}}>Màu sắc</th>
                            <th style = {{color:'#808080', fontWeight: "none"}}>Giá sản phẩm</th>
                            <th style = {{color:'#808080', fontWeight: "none"}}>Phiếu giảm giá</th>
                            <th style = {{color:'#808080', fontWeight: "none"}}>Số lượng</th>
                            <th style = {{color:'#808080', fontWeight: "none"}}>Tổng tiền</th>
                            <th style = {{color:'#808080', fontWeight: "none"}}></th>
                        </tr>
                    </thead>

                    <tbody>
                        {cartItems.map((cartItem) => (
                            <tr key={cartItem.cartId} className='text-center'>
                                <td>
                                    {cartItem.imageProduct && (
                                        <img
                                            src={cartItem.imageProduct}
                                            alt={`Photo of ${cartItem.imageProduct}`}
                                            style={{ width: '50px', height: '45px' }}
                                        />
                                    )}
                                </td>
                                <td>{cartItem.nameProduct}</td>
                                <td>{cartItem.size}</td>
                                <td>{cartItem.color}</td>
                                <td className='text-danger'>{formatCurrency(cartItem.price)}</td>
                                <td>
                                <span style={{ fontSize: '12px', color: 'white', backgroundColor: cartItem.disCount !== 0 ? 'red' : 'green', padding: '2px 5px', borderRadius: '3px', fontWeight: 'bold' }}>
                                {
                                cartItem.disCount > 0
                                    ? (cartItem.percentage
                                        ? `Giảm ${cartItem.disCount}%`
                                        : `Giảm ${formatCurrency(cartItem.disCount)}`)
                                    : 'Không có giảm giá'
                                }

                                </span>
                                </td>
                                <td><div className="d-flex align-items-center justify-content-center h-100">
                                <button className="btn btn-primary" onClick={() => decreaseQuantity(localStorage.getItem('cartId'),cartItem.cartId, cartItem.size)}>-</button>
                                    <input
                                        type="text"
                                        value={quantities[cartItem.cartId]}
                                        readOnly
                                        className="form-control mx-2 text-center"
                                        style={{ width: '50px' }}
                                    />
                                <button className="btn btn-primary" onClick={() => increaseQuantity(localStorage.getItem('cartId'),cartItem.cartId, cartItem.size)}>+</button>
                                </div></td>
                                <td className='text-danger'>{
                                cartItem.disCount ? formatCurrency(cartItem.percentage ? ((cartItem.price - cartItem.price * (cartItem.disCount / 100 ))* cartItem.quantity) : ((cartItem.price - cartItem.disCount))* cartItem.quantity)
                                    : formatCurrency(cartItem.price * cartItem.quantity)
                                }</td>
                                <td>
                                <button className="btn btn-sm" onClick={() => handleDelete(localStorage.getItem('cartId'), cartItem.cartId)}>
                                    <p style = {{fontSize: '20px'}}>×</p>
                                </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

            </table>
        </div>
        </div>
        </div>

        <div className = "mx-5 pt-3 d-flex">
            <Link to = "/home/product-filter" className='btn btn-danger'><i class="bi bi-arrow-left mx-2"></i>Tiếp tục xem sản phẩm</Link>
            <button className='btn btn-primary mx-3' onClick={handleReload}>Cập nhật giỏ hàng</button>
        </div>

        <div className = 'py-3 mx-5'>
            <div className = "row">
                <div className = "col-7" style = {{borderTop :"1px solid rgba(0, 0, 0, 0.2)"}}>
                    <div className = "mx-3 py-3">
                        <h4>THÔNG TIN THANH TOÁN</h4>
                    </div>
                    <form className = 'container pb-4'>
                        <div className="row mt-3  align-items-center">
                            <div className = "col-12">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="lastName"
                                    name="lastName"
                                    value={customer.lastName}
                                    onChange={handleChange}
                                    placeholder='Họ'
                                />
                            </div>
                        </div>

                        <div className="row mt-3 align-items-center">
                            <div className = "col-12">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="firstName"
                                    name="firstName"
                                    value={customer.firstName}
                                    onChange={handleChange}
                                    placeholder='Tên'
                                />
                            </div>
                        </div>

                        <div className="row mt-3 align-items-center">
                            <div className = "col-12">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={customer.phoneNumber}
                                    onChange={handleChange}
                                    placeholder='Số điện thoại'
                                />
                            </div>
                        </div>

                        <div className="row mt-3 align-items-center">
                            <div className = "col-12">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="address"
                                    name="address"
                                    value={customer.address}
                                    onChange={handleChange}
                                    placeholder='Địa chỉ giao hàng'
                                />
                            </div>
                        </div>
                    </form>
                </div>

                <div className = "col-5">
                    <div className = 'h-100 w-100' style = {{border: "2px solid orange"}}>
                        <div className = "mx-3 py-3">
                            <h4>ĐƠN HÀNG CỦA BẠN</h4>
                            <table className='table table-hover'>
                                <thead>
                                    <tr>
                                        <th className='text-start'>Sản phẩm</th>
                                        <th className='text-end'>Tổng</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {cartItems.map((cartItem) => (
                                    <tr key={cartItem.cartId} className='text-center'>
                                        <td className='text-start'>{cartItem.nameProduct}</td>
                                        <td className ="text-end text-danger">{
                                        cartItem.disCount ? formatCurrency(cartItem.percentage ? ((cartItem.price - cartItem.price * (cartItem.disCount / 100 ))* cartItem.quantity) : ((cartItem.price - cartItem.disCount))* cartItem.quantity)
                                        : formatCurrency(cartItem.price * cartItem.quantity)
                                        }</td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className='mt-2' style = {{borderTop: "1px solid orange"}}>
                                <p className='mt-2'><strong>Chọn hình thức thanh toán:</strong></p>
                                <div>
                                <label className={paymentMethod === "VNPAY" ? "text-success" : ""}>
                                    <input
                                    type="radio"
                                    value="VNPAY"
                                    className="mx-2"
                                    checked={paymentMethod === "VNPAY"}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    Thanh toán qua VNPay
                                </label>
                                </div>

                                <div>
                                <label className={paymentMethod === "E_WALLET" ? "text-success" : ""}>
                                    <input
                                    type="radio"
                                    value="E_WALLET"
                                    className="mx-2"
                                    checked={paymentMethod === "E_WALLET"}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    Thanh toán qua ví điện tử
                                </label>
                                </div>

                                <div>
                                <label className={paymentMethod === "COD" ? "text-success" : ""}>
                                    <input
                                    type="radio"
                                    value="COD"
                                    className="mx-2"
                                    checked={paymentMethod === "COD"}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    Thanh toán khi nhận hàng
                                </label>
                                </div>
                            </div>

                            <div className='mt-2 d-flex justify-content-between' style = {{borderTop: "1px solid orange"}}>
                                <h5 className='mt-2'>Tổng tiền:</h5>
                                <p className='mt-2 text-danger'><strong>{formatCurrency(totalMoney)}</strong></p>
                            </div>
                            {paymentMethod === "COD" && (
                            <button className="py-2 w-100 btn btn-warning" onClick={handleSubmitOrder}>
                                <strong>Đặt hàng</strong>
                            </button>
                            )}

                            {paymentMethod === "VNPAY" && (
                            <button className="py-2 w-100 btn btn-success" onClick={() => handlePayment(totalMoney)}>
                                <strong>Thanh toán bằng VNPAY</strong>
                            </button>
                            )}

                            {paymentMethod === "E_WALLET" && (
                            <button className="py-2 w-100 btn btn-success" onClick={handleWallet}>
                                <strong>Thanh toán qua ví điện tử</strong>
                            </button>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default MyCart
