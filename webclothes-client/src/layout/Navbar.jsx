import React, { useEffect, useState } from 'react'
import { logout } from '../api/Auth';
import { Link, useNavigate } from 'react-router-dom';
import { getCustomerById } from '../api/Customer';

const Navbar = () => {

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [customerDetail, setCustomerDetail] = useState("");
  const [userId, setUserId] = useState("");


  const fetchAvatar = async (id) => {
    try {
      const customerData = await getCustomerById(id);
      setCustomerDetail(customerData || null);
    } catch (error) {
      console.error('Error fetching customer data:', error);
    }
  };

  

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    const storedUserId = localStorage.getItem("id");

    if (token) {
        setUsername(storedUsername);
        setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchAvatar(userId);
    }
  }, [userId]);

  const handleLogout = async () => {
    try {
      await logout();
      setUsername("");
      navigate('/home');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  return (
    <>
        <div className="header container-fluid fixed-top" style={{ backgroundColor: 'white',height: '60px', boxShadow: '0 0 50px rgba(0, 0, 0, 0.5)'}}>
        <div className="w-100 h-100 d-flex justify-content-between">
          <div className="mx-4 h-100 w-25 d-flex justify-content-start align-items-center">
            <Link to = "/home" className="h-100 d-flex align-items-center text-decoration-none" style={{ fontSize: '20px', color : 'rgb(17, 150, 251)' }}><h5 className="mx-4 m-0">Shop Clothes</h5></Link>
          </div>

          <div className="h-100 d-flex justify-content-end align-items-center">
              <div className="d-flex justify-content-center align-items-center">
                <div class=" dropdown-toggle h-100" data-bs-toggle="dropdown">
                {customerDetail && customerDetail.avatar ? (
                <img
                        src={`data:image/jpeg;base64,${customerDetail.avatar}`}
                        alt="Avatar"
                        style={{ width: "28px", height: "28px", objectFit: "cover" }}
                        className='rounded-circle'
                      />
                    ) : (
                <img
                        src="https://via.placeholder.com/32"
                        alt="Default Avatar"
                        style={{ width: "28px", height: "28px", objectFit: "cover" }}
                        className='rounded-circle'
                />
                )}
                </div>
                <ul class="dropdown-menu">
                    <li><Link to ={`/home/account/profile/${userId}`} class="dropdown-item" >Thông tin cá nhân</Link></li>
                    <li><Link to = {`/home/account/order/${customerDetail.customerId}`} class="dropdown-item">Đơn hàng</Link></li>
                    <li><a class="dropdown-item" onClick={handleLogout}>Đăng xuất</a></li>
                </ul>
                <div className="d-flex justify-content-center align-items-center h-100 mx-2"><span style = {{fontSize:"16px", color: "blue"}}>{username}</span></div>
              </div>
          </div>
        </div>
      </div>

      <div style={{ height: '60px' }}></div>
    </>

  )
}

export default Navbar
