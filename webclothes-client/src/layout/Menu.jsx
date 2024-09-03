import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';

const Menu = () => {
  const [activeItem, setActiveItem] = useState('');
  const location = useLocation();
    useEffect(() => {
      if (location.pathname === '/dashboard') {
        setActiveItem('dashboard');
      } else if (location.pathname === '/dashboard/category') {
        setActiveItem('danh-muc-san-pham');
      } else if (location.pathname === '/dashboard/brand') {
        setActiveItem('danh-sach-thuong-hieu');
      } else if (location.pathname === '/dashboard/products') {
        setActiveItem('danh-sach-san-pham');
      } else if (location.pathname === '/dashboard/user') {
        setActiveItem('quan-ly-nguoi-dung');
      } else if (location.pathname === '/dashboard/order') {
        setActiveItem('danh-sach-don-hang');
      } else if (location.pathname === '/dashboard/contact') {
        setActiveItem('quan-ly-lien-he');
      } else if (location.pathname === '/dashboard/chart') {
        setActiveItem('bieu-do');
      }
    }, [location]);

    const handleItemClick = (itemId) => {
      setActiveItem(itemId);
    };
    return (
      <>
          <div className="w-100 h-100">
          <div className="row h-100">
            <div className="position-fixed fixed-left col-xl-2 col-lg-2 col-sm-2 col-md-2" style={{ backgroundColor: 'rgb(255, 255, 255)', padding: 0, borderRight: '2px solid rgb(211, 207, 207)', overflowY: 'auto' }}>
              <nav className="navbar navbar-light py-0 mt-4 mx-3">
                <ul className="navbar-nav text-primary w-100" id="nav-list" style={{ paddingLeft: 0 }}>

                <li className={`mt-2 nav-item ${activeItem === 'dashboard' ? 'active' : ''}`} style={{ listStyleType: 'none' }}>
                    <Link to = "/dashboard" className="nav-link d-block" style={{ display: 'flex', alignItems: 'center' }} onClick={() => handleItemClick('dashboard')}>
                    <i class="bi bi-house-door-fill mx-1 fw-bold"></i>
                      <span className='fw-bold'>Trang chủ</span>
                    </Link>
                  </li>

                  <li className={`mt-2 nav-item ${activeItem === 'quan-ly-nguoi-dung' ? 'active' : ''}`} style={{ listStyleType: 'none' }}>
                    <Link to = "/dashboard/user" className="nav-link d-block" style={{ display: 'flex', alignItems: 'center' }} onClick={() => handleItemClick('quan-ly-nguoi-dung')}>
                    <i class="bi bi-person-lines-fill mx-1 fw-bold"></i>
                      <span className='fw-bold'>Quản lý người dùng</span>
                    </Link>
                  </li>

                  <li className={`mt-2 nav-item ${activeItem === 'danh-muc-san-pham' ? 'active' : ''}`} style={{ listStyleType: 'none' }}>
                    <Link to = "/dashboard/category" className="nav-link d-block" style={{ display: 'flex', alignItems: 'center' }} onClick={() => handleItemClick('danh-muc-san-pham')}>
                    <i class="bi bi-tag-fill mx-1 fw-bold"></i>
                      <span className='fw-bold'>Danh mục sản phẩm</span>
                    </Link>
                  </li>
  
                  <li className={`mt-2 nav-item ${activeItem === 'danh-sach-thuong-hieu' ? 'active' : ''}`} style={{ listStyleType: 'none' }}>
                    <Link to = "/dashboard/brand" className="nav-link d-block" style={{ display: 'flex', alignItems: 'center' }} onClick={() => handleItemClick('danh-sach-thuong-hieu')}>
                      <i className="bi bi-card-list mx-1 fw-bold"></i>
                      <span className='fw-bold'>Danh sách thương hiệu</span>
                    </Link>
                  </li>
                  <li className={`mt-2 nav-item ${activeItem === 'danh-sach-san-pham' ? 'active' : ''}`} style={{ listStyleType: 'none' }}>
                    <Link to = "/dashboard/product" className="nav-link d-block" style={{ display: 'flex', alignItems: 'center' }} onClick={() => handleItemClick('danh-sach-san-pham')}>
                      <i className="bi bi-cart-fill mx-1 fw-bold"></i>
                      <span className='fw-bold'>Danh sách sản phẩm</span>
                    </Link>
                  </li>
                  <li className={`mt-2 nav-item ${activeItem === 'danh-sach-don-hang' ? 'active' : ''}`} style={{ listStyleType: 'none' }}>
                    <Link to = "/dashboard/order" className="nav-link d-block" style={{ display: 'flex', alignItems: 'center' }} onClick={() => handleItemClick('danh-sach-don-hang')}>
                      <i className="bi bi-bag-fill mx-1 fw-bold"></i>
                      <span className='fw-bold'>Danh sách đơn hàng</span>
                    </Link>
                  </li>

                  <li className={`mt-2 nav-item ${activeItem === 'quan-ly-lien-he' ? 'active' : ''}`} style={{ listStyleType: 'none' }}>
                    <Link to = "/dashboard/contact" className="nav-link d-block" style={{ display: 'flex', alignItems: 'center' }} onClick={() => handleItemClick('quan-ly-lien-he')}>
                      <i className="bi bi-chat-dots-fill mx-1 fw-bold"></i>
                      <span className='fw-bold'>Quản lý liên hệ</span>
                    </Link>
                  </li>

                  <li className={`mt-2 nav-item ${activeItem === 'bieu-do' ? 'active' : ''}`} style={{ listStyleType: 'none' }}>
                    <Link to = "/dashboard/chart" className="nav-link d-block" style={{ display: 'flex', alignItems: 'center' }} onClick={() => handleItemClick('bieu-do')}>
                      <i className="bi bi-bar-chart-fill mx-1 fw-bold"></i>
                      <span className='fw-bold'>Biểu đồ</span>
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
  
            
            </div>
            </div>
      </>
      )
}

export default Menu
