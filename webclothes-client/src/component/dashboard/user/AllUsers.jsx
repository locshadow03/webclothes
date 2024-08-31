import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaEdit, FaEye, FaTrashAlt} from 'react-icons/fa';
import { getAllUsers, updateRole } from '../../../api/User';
import ProductPaginator from '../../common/ProductPaginator';
import { getCustomerById } from '../../../api/Customer';
const AllUsers = () => {

    const[users, setUsers] = useState([])

    const [userDetail, setUserDetail] = useState("");

    const [successMessage, setSuccessMessage] = useState("")

    const [errorMessage, setErrorMessage] = useState("")

    const[currentPage, setCurrenPage] = useState(1)
    const[usersPerPage] = useState(8)

    const listroles = [
        'USER',
        'ADMIN'
    ];

    const handleRoleChange = async (userId, newRole) => {
        try {
            await updateRole(userId, newRole);
            fetchUsers();
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const handlePaginationClick = (pageNumber) =>{
        setCurrenPage(pageNumber)
    }

    const calculateTotalPages = (usersPerPage, users) =>{
        const totalUsers = users.length
        return Math.ceil(totalUsers / usersPerPage)
    }

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    useEffect(() =>{
        fetchUsers()
        console.error("ERROR sau khi lấy dữ liệu", users)
    },[])
    
    const fetchUsers = async () =>{
        try {
            const result = await getAllUsers();
            console.error("ERROR sau khi lấy dữ liệu", result)
            setUsers(result)
        } catch (error) {
            setErrorMessage("Error fetching users");
            console.error("ERROR", error.message);
        }
    }

    const handleCustomer = async (userId) =>{
        try{
            const result = await getCustomerById(userId);
            setUserDetail(result)
        } catch (error) {
            console.error("ERROR", error.message);
        }
    }


  return (
    <>
    {successMessage && (
        <div className="alert alert-success mx-5 mt-5" role="alert">
            {successMessage}
        </div>
    )}

    {errorMessage && (
        <div className="alert alert-danger mx-5 mt-5" role="alert">
            {errorMessage}
        </div>
    )}
    
    <div className='d-flex justify-content-between align-content-center mt-5 mx-5'>
        <div className=''>
            <h4>Danh sách người dùng</h4>
        </div>      
        <Link to = "/dashboard/brand/add/new-brand" className = "btn btn-primary">
            Add user
        </Link>
        </div>
        {/* <p className='mx-5 my-3 fw-bold'>Tổng số thương hiệu: {totalBrands}</p> */}
    <div className = "mx-5 mt-4">
    <table className='table table-hover' style = {{boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'}}>
                <thead>
                    <tr className='text-center'>
                        <th>ID</th>
                        <th>User name</th>
                        <th>Email</th>
                        <th>Ngày tạo</th>
                        <th>Ngày cập nhật</th>
                        <th>Phân quyền</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>

                {currentUsers.map((user) => (
                        <tr key={user.id} className='text-center'>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.createdAt}</td>
                            <td>{user.updatedAt}</td>
                            <td>
                                <select className='py-2 status-select'
                                    value={user.role || ''}
                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                >
                                {listroles.map(roleUser => (
                                    <option key={roleUser} value={roleUser}>{roleUser}</option>
                                ))}
                                </select>
                            </td>
                            <td className='gap-2'>
                                <button
                                    className='btn btn-primary btn-sm mx-2' data-bs-toggle="modal" data-bs-target="#myModal"
                                    onClick = {() => handleCustomer(user.customerId)}
                                    >
                                    <FaEye />
                                </button>
                            
                                <button
                                    className='btn btn-danger btn-sm mx-2'
                                    >
                                    <FaTrashAlt />
                                </button>
                            </td>
                        </tr>
                    ))}
                  
                </tbody>
      </table>

      <ProductPaginator currentPage={currentPage} totalPages={calculateTotalPages(usersPerPage, users)}
            onPageChange={handlePaginationClick} />

        <div class="modal" id="myModal">
                <div class="modal-dialog modal-xl modal-dialog-centered">
                <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">Thông tin chi tiết tài khoản</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                <form className = "mx-5 mt-2">
                    <div className='mb-3'>
                            <div className = "mb-3 w-100 d-flex justify-content-center align-items-center">
                            {userDetail && userDetail.avatar ? (
                                <img
                                    src={`data:image/jpeg;base64,${userDetail.avatar}`}
                                    alt="Avatar"
                                    style={{ width: "300px", height: "300px", objectFit: "cover" }}
                                    className='rounded-circle'
                                />
                                ) : (
                                <img
                                    src="https://via.placeholder.com/32"
                                    alt="Default Avatar"
                                    style={{ width: "300px", height: "300px", objectFit: "cover" }}
                                    className='rounded-circle'
                                />
                                )}
                            </div>
                            <div className='mb-3'>
                                <label htmlFor='lastName' className='form-lable'>Họ</label>
                                <input id="lastName" name="lastName" type="text" className='form-control' value={userDetail.firstName} readOnly
                                />
                            </div>
                            <div className='mb-3'>
                                <label htmlFor='firstName' className='form-lable'>Tên</label>
                                <input id="firstName" name="firstName" type="text" className='form-control' value={userDetail.lastName} readOnly
                                />
                            </div>
                            <div className='mb-3'>
                                <label htmlFor='phoneNumber' className='form-lable'>Số điện thoại</label>
                                <input id="phoneNumber" name="phoneNumber" type="text" className='form-control' value={userDetail.phoneNumber} readOnly
                                />
                            </div>

                            <div className='mb-3'>
                                <label htmlFor='address' className='form-lable'>Địa chỉ</label>
                                <input id="address" name="address" type="text" className='form-control' value={userDetail.address} readOnly
                                />
                            </div>
                        
                    </div>
                </form>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
     </div>

      </div>
    </>
  )
}

export default AllUsers
