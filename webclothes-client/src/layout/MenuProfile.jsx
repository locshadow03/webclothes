import React, { useEffect, useState } from 'react'
import { getCustomerById } from '../api/Customer';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../api/Auth';

const MenuProfile = () => {
    const navigate = useNavigate();
    const [customerDetail, setCustomerDetail] = useState("");
    const userId = localStorage.getItem("id");
    const username = localStorage.getItem("username");
    const [activeLink, setActiveLink] = useState('');
    const handleLinkClick = (link) => {
        setActiveLink(link); // Cập nhật trạng thái của link được chọn
      };

    const fetchCustomer = async () =>{
        try {
            const customerData = await getCustomerById(userId);
            
            setCustomerDetail(customerData || null);
        } catch (error) {
            console.error('Error fetching customer data:', error);
        }
    }
    
      useEffect(() => {
        fetchCustomer()
        console.error("customer:", customerDetail)
      }, []);

      const handleLogout = async () => {
        try {
          await logout();
          navigate('/home');
        } catch (error) {
          console.error('Logout error:', error);
        }
      };
  return (
    <>
    <div className = 'w-100 pb-5'>
        <div className="d-flex justify-content-center align-items-center">
            <div class="h-100" style = {{height:"100px"}}>
                {/* <img src="https://via.placeholder.com/800x400?text=Slide+1" class="rounded-circle" style={{width: "100px", height: "100px", objectFit: "cover"}} alt="Avatar"/> */}
                {customerDetail && customerDetail.avatar ? (
                      <img
                        src={`data:image/jpeg;base64,${customerDetail.avatar}`}
                        alt="Avatar"
                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                        className='mb-3 rounded-circle'
                      />
                    ) : (
                      <img
                        src="https://via.placeholder.com/32"
                        alt="Default Avatar"
                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                        className='mb-3 rounded-circle'
                      />
                    )}
            </div>

            <div className = "h-100 mx-2 text-center"  style = {{height:"100px"}}>
                <div className = "">
                    <strong>{username ? username : 'Tên người dùng'}</strong>
                </div>
                <Link to ={`/home/account/profile/${userId}`} className = "text-decoration-none" onClick={() => handleLinkClick('profileCustomers')}>
                    <span><i class="bi bi-pencil-fill"></i> Sửa hồ sơ</span>
                </Link>
            </div>
        </div>

        <div className = "mx-5 mt-3">
        <ul class="nav d-flex flex-column">
            <li class="nav-item">
                <a class="nav-link text-black" href="#collapseOne" data-bs-toggle="collapse"><i class="bi bi-person-fill mx-2" style = {{color: "blue"}}></i>Tài khoản của tôi</a>
            </li>
            <div id="collapseOne" class="collapse show" data-bs-parent="#accordion">
            <ul class="nav d-flex flex-column text-start mx-3">
                <li class="nav-item">
                    <Link to ={`/home/account/profile/${userId}`} class="nav-link"
                        style={{ color: activeLink === 'profileCustomers' ? 'blue' : '#808080' }}
                        onClick={() => handleLinkClick('profileCustomers')}
                    >Hồ sơ</Link>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" style = {{color: "#808080"}}>Sửa tài khoản</a>
                </li>
            </ul>
            </div>
            <li class="nav-item">
                <Link to = {`/home/account/order/${customerDetail.customerId}`} class="nav-link"
                    style={{ color: activeLink === 'orders' ? 'blue' : 'black' }}
                    onClick={() => handleLinkClick('orders')}><i class="bi bi-receipt mx-2"  
                    style = {{color: "red"}}></i>Đơn hàng</Link>
            </li>
            <li class="nav-item">
                <a class="nav-link text-black" href="#"><i class="bi bi-bell-fill mx-2" style = {{color: "blue"}}></i>Thông báo</a>
            </li>
            <li class="nav-item">
                <a class="nav-link text-black" href="#"><i class="bi bi-gear-fill mx-2" style = {{color: "orange"}}></i>Cài đặt</a>
            </li>
            <li class="nav-item">
                <a class="nav-link text-black" href="#" onClick={handleLogout}><i class="bi bi-box-arrow-in-right mx-2"  style = {{color: "blue"}}></i>Đăng xuất</a>
            </li>
        </ul>
        </div>
    </div>
    </>
  )
}

export default MenuProfile
