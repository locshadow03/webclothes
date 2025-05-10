import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { getUserById } from '../../api/User';
import { getCustomerById, updateCustomer } from '../../api/Customer';

const Profile = () => {
    const handleClick = () => {
        document.getElementById('photo').click();
    };

    const [userDetail, setUserDetail] = useState("");
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")


    const [customerUpdate, setCustomerUpdate] = useState({
        firstName :"",
        lastName :"",
        phoneNumber : "",
        address : "",
        avatar : null
    })

    const [imagePreview, setImagePreview] = useState("")

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0]
        setCustomerUpdate({ ...customerUpdate, avatar: selectedImage })
        setImagePreview(URL.createObjectURL(selectedImage))
    }

    const handleCustomerInputChange = (event) => {
        const {name, value} = event.target
        setCustomerUpdate({...customerUpdate, [name] : value})
    }

    const {userId} = useParams()

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userData = await getUserById(userId);

                if (userData && userData.statusCode === 200) {
                    setUserDetail(userData);
                } else {
                    setErrorMessage("Lỗi: Mã trạng thái không phải là 200");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                setErrorMessage("Lỗi: Không thể lấy dữ liệu người dùng");
            }
        };

        const fetchCustomer = async() =>{
            try {
                const customerData = await getCustomerById(userId);
                if (customerData) {
                    setCustomerUpdate(customerData);
                    setImagePreview(customerData.avatar ? `data:image/jpeg;base64,${customerData.avatar}` : "");
                } else {
                    // Handle case where customer data is not available
                    setCustomerUpdate({
                        firstName: "",
                        lastName: "",
                        phoneNumber: "",
                        address: "",
                        avatar: null
                    });
                    setImagePreview("");
                } 
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
        fetchUsers();
        fetchCustomer();
    }, [userId]);


      const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await updateCustomer(userId, customerUpdate)
            if (response !== null){
              setSuccessMessage("Cập nhật tài khoản thành công!")
              const updateCustomerData = await getCustomerById(userId)
              setCustomerUpdate(updateCustomerData)
              setImagePreview(`data:image/jpeg;base64,${updateCustomerData.avatar}`)
              window.location.reload();
                setErrorMessage("")
            } else {
                setErrorMessage("Lỗi cập nhật!")
            }
        } catch (error) {
            setErrorMessage(error.message)
        }
    }
  return (
    <>
        <div className=''>
            <div className=' mx-3 mt-3 py-1' style = {{boxShadow: '0 4px 4px -2px rgba(0, 0, 0, 0.1)'}}>
                <h5>Quản lý hồ sơ của tôi</h5>
                {successMessage && (
                    <div className="alert alert-success" role="alert">
                        {successMessage}
                    </div>
                )}
                {errorMessage && (
                    <div className="alert alert-danger" role="alert">
                        {errorMessage}
                    </div>
                )}
                <p style = {{color: "#808080"}}>Để bảo mật tài khoản</p>
            </div>

            <div className='row mx-2 py-3' onSubmit={handleSubmit}>
                <div className='col-8' style = {{borderRight: '2px solid rgba(0, 0, 0, 0.1)'}}>
                    <form className = 'container'>
                        <div className="row mt-3 align-items-center">
                            <div className = "col-3">
                                <label htmlFor="username" className="form-label">Tên đăng nhập</label>
                            </div>
                            <div className = "col-9">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="username"
                                    name="username"
                                    value={userDetail.username}
                                />
                            </div>
                        </div>
                        <div className="row mt-3  align-items-center">
                            <div className = "col-3">
                                <label htmlFor="lastName" className="form-label">Họ</label>
                            </div>
                            <div className = "col-9">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="lastName"
                                    name="lastName"
                                    value={customerUpdate.lastName}
                                    onChange={handleCustomerInputChange}
                                />
                            </div>
                        </div>

                        <div className="row mt-3 align-items-center">
                            <div className = "col-3">
                                <label htmlFor="firstName" className="form-label">Tên</label>
                            </div>
                            <div className = "col-9">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="firstName"
                                    name="firstName"
                                    value={customerUpdate.firstName}
                                    onChange={handleCustomerInputChange}
                                />
                            </div>
                        </div>

                        <div className="row mt-3 align-items-center">
                            <div className = "col-3">
                                <label htmlFor="email" className="form-label">Email</label>
                            </div>
                            <div className = "col-9">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    value={userDetail ? userDetail.email : ''}
                                />
                            </div>
                        </div>

                        <div className="row mt-3 align-items-center">
                            <div className = "col-3">
                                <label htmlFor="phoneNumber" className="form-label">Số điện thoại</label>
                            </div>
                            <div className = "col-9">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={customerUpdate.phoneNumber}
                                    onChange={handleCustomerInputChange}
                                />
                            </div>
                        </div>

                        <div className="row mt-3 align-items-center">
                            <div className = "col-3">
                                <label htmlFor="address" className="form-label">Địa chỉ</label>
                            </div>
                            <div className = "col-9">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="address"
                                    name="address"
                                    value={customerUpdate.address}
                                    onChange={handleCustomerInputChange}
                                />
                            </div>
                        </div>
                        <div className = 'row'>
                            <div className = 'col-3'></div>
                            <div className = 'col-9'>
                                <button type="submit" className="btn btn-primary mt-3 px-5 mb-4">Lưu</button>
                            </div>
                        </div>
                    </form>
                </div>
                
                <div className='col-4'>
                <div className="d-flex flex-column align-items-center">
                    <div class="h-100" style = {{height:"100px"}}>
                    {imagePreview ? (
                        <img
                            src={imagePreview}
                            alt="Preview product Photo"
                            style={{ width: "250px", height: "250px", objectFit: "cover" }}
                            className="mb-3 rounded-circle"
                        />
                        ) : (
                        <div style={{ width: "250px", height: "250px" }} className="mb-3 rounded-circle d-flex align-items-center justify-content-center bg-light">
                            <span>No image available</span>
                        </div>
                    )}
                    </div>

                    <div className = "h-100 mx-2 text-center"  style = {{height:"100px"}}>
                        <div className = "" style = {{color: '#808080'}}>
                            <p>Dụng lượng file tối đa 1 MB
                            Định dạng:.JPEG, .PNG</p>
                        </div>
                        
                    </div>

                    <div className='mb-3'>
                    <input
                        id="photo"
                        name="photo"
                        type="file"
                        className='form-control'
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                    />
                    <button
                        type="button"
                        className='btn btn-primary'
                        onClick={handleClick}
                    >
                        Chọn ảnh
                    </button>
                    </div>
                </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Profile
