import React from 'react'
import { FaEye, FaTrashAlt } from 'react-icons/fa';

const OrderItem = ({order, onViewDetails, onConfirmDelete}) => {
    
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
          minimumFractionDigits: 0,
        }).format(value);
      };
  return (
    <>
        <div className = "mx-1 mt-4">
            <table className='table table-hover' style = {{boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'}}>

                <tbody>
                    <tr key={order.orderId} className='text-center'>
                        <td style = {{fontWeight :'bold', color: "green"}}>{order.orderCode}</td>
                        <td>{order.firstName}</td>
                        <td>{order.phoneNumber}</td>
                        <td>{order.address}</td>
                        
                        <td className = 'text-warning'>
                            {order.statusOrder}
                         </td>

                        <td className='text-danger'>{formatCurrency(order.totalAmount)}</td>
                        <td className='gap-2'>
                            <button
                                className='btn btn-primary btn-sm mx-2'
                                data-bs-toggle="modal"
                                data-bs-target="#myModal"
                                onClick={() => onViewDetails(order.orderId)}
                            >
                                <FaEye />
                            </button>

                            <button
                                className='btn btn-danger btn-sm mx-2'
                                data-bs-toggle="modal"
                                data-bs-target="#myModal1"
                                onClick={() => onConfirmDelete(order.orderId)}
                            >
                                <FaTrashAlt />
                            </button>
                        </td>
                    </tr>
                    
                </tbody>
            </table>

        </div>

    </>
  )
}

export default OrderItem
