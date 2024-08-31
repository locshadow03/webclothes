import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteCartItem, getAllCartItems, updateCartItem } from '../../api/Cart'
import { getCustomerById } from '../../api/Customer'
import { addOrder } from '../../api/Order'
import { toast } from 'react-toastify'

const MyCart = () => {
    const[cartItems, setCartItems] = useState([])
    const[selectedSize, setSelectedSize] = useState({});
    const[errorMessage, setErrorMessage] = useState("")
    const[quantities, setQuantities] = useState({})
    
    const[totalMoney, setTotalMoney] = useState(0)

    const [customer, setCustomer] = useState({
        customerId : "",
        firstName :"",
        lastName :"",
        phoneNumber : "",
        address : "",
        avatar : null
    })

    const userId = localStorage.getItem('id')

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
                return sum + (item.price - item.price * (item.disCount / 100)) * item.quantity;
            }, 0);
            setTotalMoney(total);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const handleReload = () => {
        window.location.reload();
    };

    useEffect(() => {
        fetchCartItems();
        console.log("Updated cartItems:", cartItems);
    }, []); // Chạy một lần khi component mount

    const decreaseQuantity = async (cartId, cartItemId, size) => {
        setQuantities(prevQuantities => {
            const newQuantities = { ...prevQuantities };
            if (newQuantities[cartItemId] > 1) {
                newQuantities[cartItemId] -= 1;
            }
            updateCartItem(cartId, cartItemId, newQuantities[cartItemId], size); // Update the quantity in the database
            return newQuantities;
        });
    };
    
    const increaseQuantity = async (cartId, cartItemId, size) => {
        setQuantities(prevQuantities => {
            const newQuantities = { ...prevQuantities };
            newQuantities[cartItemId] += 1;
            updateCartItem(cartId, cartItemId, newQuantities[cartItemId], size); // Update the quantity in the database
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
                items: cartItems.map(item => ({
                    product: { id: item.productId },
                    quantity: item.quantity,
                    size: item.size,
                    price: item.price
                }))
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
            setErrorMessage(error.message);
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
                                            src={`data:image/jpeg;base64,${cartItem.imageProduct}`}
                                            alt={`Photo of ${cartItem.imageProduct}`}
                                            style={{ width: '50px', height: '45px' }}
                                        />
                                    )}
                                </td>
                                <td>{cartItem.nameProduct}</td>
                                <td>{cartItem.size}</td>
                                <td className='text-danger'>{formatCurrency(cartItem.price)}</td>
                                <td>
                                <span style={{ fontSize: '12px', color: 'white', backgroundColor: cartItem.disCount !== 0 ? 'red' : 'green', padding: '2px 5px', borderRadius: '3px', fontWeight: 'bold' }}>
                                            {cartItem.disCount !== 0 ?  `Giảm ${cartItem.disCount}%`  : 'Không có giảm giá'}
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
                                <td className='text-danger'>{formatCurrency((cartItem.price - cartItem.price * (cartItem.disCount / 100 ))* cartItem.quantity)}</td>
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
                                        <td className ="text-end text-danger">{formatCurrency((cartItem.price - cartItem.price * (cartItem.disCount / 100 ))* cartItem.quantity)}</td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className='mt-2' style = {{borderTop: "1px solid orange"}}>
                                <p className='mt-2'><strong>Chọn hình thức thanh toán:</strong></p>
                                <div>
                                    <label>
                                        <input
                                            type="radio"
                                            value="online" className = 'mx-2'
                                            disabled
                                        />
                                        Thanh toán trực tuyến
                                    </label>
                                </div>
                                <div>
                                    <label style={{ color: 'green' }}>
                                        <input
                                            type="radio"
                                            value="cash" className = 'mx-2'
                                            checked
                                            readOnly
                                        />
                                        Thanh toán khi nhận hàng
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        <input
                                            type="radio"
                                            value="bank" className = 'mx-2'
                                            disabled
                                        />
                                        Chuyển khoản ngân hàng
                                    </label>
                                </div>
                            </div>

                            <div className='mt-2 d-flex justify-content-between' style = {{borderTop: "1px solid orange"}}>
                                <h5 className='mt-2'>Tổng tiền:</h5>
                                <p className='mt-2 text-danger'><strong>{formatCurrency(totalMoney)}</strong></p>
                            </div>

                            <button className='py-2 w-100 btn btn-warning' onClick={handleSubmitOrder}><strong>Xác nhận đặt hàng</strong></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default MyCart
