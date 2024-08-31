import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { deleteOrder, getAllOrdersByCustomer, getDetailById } from '../../api/Order';
import { useParams } from 'react-router-dom';
import { FaEye, FaTrashAlt } from 'react-icons/fa';
import OrderItem from './OrderItem';
import { toast } from 'react-toastify';

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('Chờ xác thực');
  const[errorMessage,setErrorMessage] = useState("")
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null); 

  const {customerId} = useParams()

  const fetchMyOrders = async () => {
    try {
        const result = await getAllOrdersByCustomer(customerId);
        setOrders(result);
        console.error('Orders:', orders);
    } catch (error) {
        setErrorMessage(error.message);
    }
    };

  useEffect(() => {
    fetchMyOrders()
  }, [customerId]);

  const handleViewDetails = async (orderId) => {
    try {
        const result = await getDetailById(orderId);
        setSelectedOrder(result);
    } catch (error) {
        console.error("Error fetching order details:", error);
    }
    };

    const handleConfirmDelete = (orderId) => {
        setOrderToDelete(orderId); // Lưu trữ ID của đơn hàng cần xóa
      };

      const handleDelete = async () => {
        if (orderToDelete) {
          try {
            await deleteOrder(orderToDelete);
            fetchMyOrders();
            setOrderToDelete(null);
            toast.success("Hủy đơn hàng thành công!");
          } catch (error) {
            setErrorMessage(error.message);
          }
        }
      };
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
          minimumFractionDigits: 0,
        }).format(value);
      };

  // Hàm để lọc đơn hàng theo trạng thái
  const filteredOrders = orders.filter(order => order.statusOrder === selectedStatus);

  return (
    <>
      <div className="row justify-content-center my-4">
        <div className="col-3">
          <button 
            className={`btn btn-outline-primary w-100 ${selectedStatus === 'Chờ xác thực' && 'active'}`}
            onClick={() => setSelectedStatus('Chờ xác thực')}
          >
            Đang chờ xử lý
          </button>
        </div>
        <div className="col-3">
          <button 
            className={`btn btn-outline-primary w-100 ${selectedStatus === 'Xác thực thành công' && 'active'}`}
            onClick={() => setSelectedStatus('Xác thực thành công')}
          >
            Đã xử lý
          </button>
        </div>
        <div className="col-3">
          <button 
            className={`btn btn-outline-primary w-100 ${selectedStatus === 'Đang giao hàng' && 'active'}`}
            onClick={() => setSelectedStatus('Đang giao hàng')}
          >
            Đang giao hàng
          </button>
        </div>
        <div className="col-3">
          <button 
            className={`btn btn-outline-primary w-100 ${selectedStatus === 'Giao hàng thành công' && 'active'}`}
            onClick={() => setSelectedStatus('Giao hàng thành công')}
          >
            Giao hàng thành công
          </button>
        </div>
      </div>

      <div>
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <OrderItem key={order.orderId} order={order} onViewDetails={handleViewDetails}  onConfirmDelete={handleConfirmDelete}/>
          ))
        ) : (
          <p>Không có đơn hàng nào trong mục này.</p>
        )}
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
                                        <div className="col-md-6">
                                            <h6>Mã đơn hàng:</h6>
                                            <p style = {{color: "green", fontWeight : "bold"}}>{selectedOrder.orderCode}</p>
                                            <h6>Tên người nhận:</h6>
                                            <p>{selectedOrder.firstName}</p>
                                            <h6>Số điện thoại:</h6>
                                            <p>{selectedOrder.phoneNumber}</p>
                                        </div>
                                        <div className="col-md-6">
                                            <h6>Địa chỉ:</h6>
                                            <p>{selectedOrder.address}</p>
                                            <h6>Trạng thái:</h6>
                                            <p>{selectedOrder.statusOrder}</p>
                                            <h6>Tổng tiền:</h6>
                                            <p className='text-danger'>{formatCurrency(selectedOrder.totalAmount)}</p>
                                        </div>
                                    </div>

                                    <h6>Chi tiết sản phẩm</h6>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Hình ảnh</th>
                                                <th>Tên sản phẩm</th>
                                                <th>Size</th>
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
                                                        src={`data:image/jpeg;base64,${item.imageProduct}`}
                                                        alt={`Photo of ${item.imageProduct}`}
                                                        style={{ width: '40px', height: '35px' }}
                                                    />
                                                    )}
                                                    </td>
                                                    <td>{item.productName}</td>
                                                    <td>{item.size}</td>
                                                    <td>{item.quantity}</td>
                                                    <td className="text-danger">
                                                        {formatCurrency(
                                                            item.disCount
                                                                ? (item.price - item.price * (item.disCount / 100)) * item.quantity
                                                                : item.price * item.quantity
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

        <div class="modal" id="myModal1">
                <div class="modal-dialog modal-xl modal-dialog-centered">
                <div class="modal-content">
                        <div class="modal-header">
                <h5 className="modal-title">Xác nhận huỷ đơn hàng</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <p>Bạn có chắc chắn muốn huỷ đơn hàng này không?</p>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={handleDelete}
                  data-bs-dismiss="modal"
                >
                  Huỷ đơn
                </button>
              </div>
            </div>
          </div>
        </div>
    </>
  );
};


export default MyOrder;

