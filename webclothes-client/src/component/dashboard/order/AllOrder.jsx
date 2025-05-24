import React, { useEffect, useState } from 'react'
import ProductPaginator from '../../common/ProductPaginator'
import { deleteOrder, getAllOrders, getDetailById, updatePaymentStatusOrder, updateStatusOrder } from '../../../api/Order'
import { FaEye, FaTrashAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { getBill } from '../../../api/Bill'

const AllOrder = () => {
    const[orders, setOrders] = useState([])
    const[currentPage, setCurrenPage] = useState(1)
    const[ordersPerPage] = useState(8)
    const[errorMessage, setErrorMessage] = useState("")
    const [selectedOrder, setSelectedOrder] = useState(null);

    const orderStatuses = [
        'Chờ xác thực',
        'Xác thực thành công',
        'Đang giao hàng',
        'Giao hàng thành công'
    ];

    const orderPaymentStatuses = [
        'Chưa thanh toán',
        'Đã thanh toán'
    ];

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateStatusOrder(orderId, newStatus);
            fetchOrders();
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const handlePaymentStatusChange = async (orderId, newStatus) => {
        try {
            await updatePaymentStatusOrder(orderId, newStatus);
            fetchOrders();
            console.log("Hien thi paymentStatus", newStatus)
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Chờ xác thực':
                return 'status-pending';
            case 'Xác thực thành công':
                return 'status-confirmed';
            case 'Đang giao hàng':
                return 'status-shipping';
            case 'Giao hàng thành công':
                return 'status-delivered';
            default:
                return '';
        }
    };


    const fetchOrders = async () => {
        try {
            const result = await getAllOrders();
            setOrders(result);
            console.error('Orders:', orders);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    useEffect(() => {
        fetchOrders()
    }, []);

    useEffect(() => {
        console.error('Đã lấy được orders:', orders);
    }, [orders]);

    const handleDelete = async(orderId) =>{
        try{
            const result = await deleteOrder(orderId)
            if(result === ""){
                toast.success("Xóa đơn hàng thành công!");
                fetchOrders()
            } else{
                console.error(`Error deleting order: ${result.message}`)
            }
        }catch(error){
            setErrorMessage(error.message)
        }
    }
    


    const handlePaginationClick = (pageNumber) =>{
        setCurrenPage(pageNumber)
    }

    const calculateTotalPages = (ordersPerPage, orders) =>{
        const totalOrders = orders.length
        return Math.ceil(totalOrders / ordersPerPage)
    }
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
          minimumFractionDigits: 0,
        }).format(value);
      };

      const handleDownloadInvoice = async (orderId) => {
        try {
            const response = await getBill(orderId);
            console.log("Bill", response);
            
            if (response.status !== 200) {
                throw new Error('Tải hóa đơn thất bại');
            }
    
            const blob = response.data;
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `hoadon_order_${orderId}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success('Tải hóa đơn thành công!');
        } catch (error) {
            console.error(error);
            toast.error('Tải hóa đơn thất bại');
        }
    };
    


    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

    const handleViewDetails = async (orderId) => {
        try {
            const result = await getDetailById(orderId);
            setSelectedOrder(result);
        } catch (error) {
            console.error("Error fetching order details:", error);
        }
    };
  return (
    <>

        <div className='d-flex justify-content-between align-content-center mt-5 mx-4'>
            <div className=''>
                <h4>Danh sách các đơn hàng</h4>
            </div>
        </div>
        <div className = "mx-4 mt-4">
            <table className='table table-hover' style = {{boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'}}>
                <thead>
                    <tr className='text-center'>
                        <th style = {{color: "blue"}}>#</th>
                        <th style = {{color: "blue"}}>Mã đơn hàn</th>
                        <th style = {{color: "blue"}}>Tên người nhận</th>
                        <th style = {{color: "blue"}}>Số điện thoại</th>
                        <th style = {{color: "blue"}}>Địa chỉ</th>
                        <th style = {{color: "blue"}}>Phương thức thanh toán</th>
                        <th style = {{color: "blue"}}>Trạng thái thanh toán</th>
                        <th style = {{color: "blue"}}>Trạng thái đơn hàng</th>
                        <th style = {{color: "blue"}}>Tổng tiền</th>
                        <th style = {{color: "blue"}}>Actions</th>
                    </tr>
                </thead>

                <tbody>
                {currentOrders.map((order, index) => (
                    <tr key={order.orderId} className='text-center'>
                        <td>{indexOfFirstOrder + index + 1}</td>
                        <td style = {{fontWeight :'bold', color: "green"}}>{order.orderCode}</td>
                        <td>{order.firstName}</td>
                        <td>{order.phoneNumber}</td>
                        <td>{order.address}</td>
                        <td>{order.paymentMethod}</td>

                        <td>
                            <select className="py-2 status-select" 
                                value={order.paymentStatus}
                                onChange={(e) => handlePaymentStatusChange(order.orderId, e.target.value)}
                            >
                            {orderPaymentStatuses.map(payMentStatus => (
                                <option key={payMentStatus} value={payMentStatus}>{payMentStatus}</option>
                            ))}
                            </select>
                         </td>
                        
                        <td>
                            <select className={`py-2 status-select ${getStatusClass(order.statusOrder)}`}
                                value={order.statusOrder}
                                onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                            >
                            {orderStatuses.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                            </select>
                         </td>

                        <td className='text-danger'>{formatCurrency(order.totalAmount)}</td>
                        <td className='gap-2'>
                            <button
                                className='btn btn-primary btn-sm mx-2'
                                data-bs-toggle="modal"
                                data-bs-target="#myModal"
                                onClick={() => handleViewDetails(order.orderId)}
                            >
                                <FaEye />
                            </button>

                            <button
                                className='btn btn-danger btn-sm mx-2'
                                onClick={() => handleDelete(order.orderId)}
                            >
                                <FaTrashAlt />
                            </button>

                            <button
                                className='btn btn-success btn-sm mx-1 mt-1'
                                onClick={() => handleDownloadInvoice(order.orderId)}
                            >
                                In bill
                            </button>
                        </td>
                    </tr>
        
                ))}
                    
                </tbody>
            </table>

            <ProductPaginator currentPage={currentPage} totalPages={calculateTotalPages(ordersPerPage, orders)}
            onPageChange={handlePaginationClick} />
        </div>

        <div class="modal" id="myModal">
                <div class="modal-dialog modal-xl modal-dialog-centered">
                <div class="modal-content">
                        <div class="modal-header">
                            <h5 className="modal-title" id="orderDetailsModalLabel">Chi tiết đơn hàng</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {selectedOrder && (
                                <div>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <h6>Mã đơn hàng:</h6>
                                            <p style = {{color: "green", fontWeight : "bold"}}>{selectedOrder.orderCode}</p>
                                            <h6>Tên người nhận:</h6>
                                            <p>{selectedOrder.firstName}</p>
                                            <h6>Số điện thoại:</h6>
                                            <p>{selectedOrder.phoneNumber}</p>
                                        </div>
                                        <div className="col-md-4">
                                            <h6>Phương thức thanh toán:</h6>
                                            <p>{selectedOrder.paymentMethod}</p>
                                            <h6>Trạng thái thanh toán:</h6>
                                            <p>{selectedOrder.paymentStatus}</p>
                                            <h6>Tổng tiền:</h6>
                                            <p className='text-danger'>{formatCurrency(selectedOrder.totalAmount)}</p>
                                        </div>
                                        <div className="col-md-4">
                                            <h6>Địa chỉ:</h6>
                                            <p>{selectedOrder.address}</p>
                                            <h6>Trạng thái:</h6>
                                            <p>{selectedOrder.statusOrder}</p>
                                        </div>
                                    </div>

                                    <h6>Chi tiết sản phẩm</h6>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Hình ảnh</th>
                                                <th>Tên sản phẩm</th>
                                                <th>Size</th>
                                                <th>Màu sắc</th>
                                                <th>Số lượng</th>
                                                <th>Giá</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedOrder.orderItems.map(item => (
                                                <tr key={item.productId}>
                                                    <td>
                                                    {item.imageProduct && (
                                                        <img
                                                        src={item.imageProduct}
                                                        alt={`Photo of ${item.imageProduct}`}
                                                        style={{ width: '40px', height: '35px' }}
                                                    />
                                                    )}
                                                    </td>
                                                    <td>{item.productName}</td>
                                                    <td>{item.size}</td>
                                                    <td>{item.color}</td>
                                                    <td>{item.quantity}</td>
                                                    <td className="text-danger">
                                                        {formatCurrency(
                                                            item.price  
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                        </div>
                    </div>
                </div>
        </div>
    </>
  )
}

export default AllOrder
