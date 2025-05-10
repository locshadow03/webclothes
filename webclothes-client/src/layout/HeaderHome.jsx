import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../api/Auth';
import { getAllCategores } from '../api/Category';
import { getCustomerById } from '../api/Customer';
import { getAllFavorites } from '../api/FavoriteProduct';
import { getAllCartItems } from '../api/Cart';

const HeaderHome = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  const [userId, setUserId] = useState("");

  const[categories, setCategories] = useState([])

  const [customerDetail, setCustomerDetail] = useState("");
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const[cartItems, setCartItems] = useState([])

  const [keyword, setKeyword] = useState('');

  const handleInputChange = (event) => {
    setKeyword(event.target.value);
  };


  const fetchFavorites = async () =>{
    try {
      const result = await getAllFavorites(localStorage.getItem("id"));
      // const cartresult = await getAllCartItems(localStorage.getItem("id"));
      // setCartItems(cartresult);
      const ids = result.map(item => item.id);
      setFavoriteProducts(ids);
      console.error("Failed to fetch favorites:", favoriteProducts);
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
    }
  }

  const fetchCarts = async () =>{
    try {
      const cartresult = await getAllCartItems(localStorage.getItem('cartId'));
      setCartItems(cartresult);
      console.error("Failed to fetch carts:", cartresult);
    } catch (error) {
      console.error("Failed to fetch carts:", error);
    }
  }


  const fetchCategorys = async (id) => {
    try {
      const customerData = await getCustomerById(id);
      setCustomerDetail(customerData || null);
    } catch (error) {
      console.error('Error fetching customer data:', error);
    }
  };

  const fetchCategory = async () =>{
    try {
      const result = await getAllCategores();
      setCategories(result);
    } catch (error) {
      console.error('Error fetching categories data:', error);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    const storedUserId = localStorage.getItem("id");

    if (token) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchCategorys(userId);
      fetchFavorites()
      fetchCarts()
    }
  }, [userId]);

  useEffect(() => {
    fetchCategory()
  }, []);


  const handleLogout = async () => {
    try {
      await logout();
      setUsername("");
      navigate('/home');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleCategoryClick = (category) => {
    if(localStorage.getItem('selectCategory') !== localStorage.setItem('selectCategory', category.nameCategory)){
      localStorage.removeItem('selectCategory');
      localStorage.removeItem('selectBrand');
      localStorage.setItem('selectCategory', category.nameCategory);
      console.error('Logout error:', localStorage.getItem('selectCategory'));
      window.location.assign('/home/product-filter');
      
    } else{
      localStorage.setItem('selectCategory', category.nameCategory);
    }
    
  };


  return (
    <>
      <div className="position-fixed w-100" style={{ zIndex: 1000, height: '140px', background: 'linear-gradient(to left, rgb(229, 237, 244) 0%, rgb(234, 245, 255) 45%)' }}>
        <div className="container-fluid" style={{ height: '35px', borderBottom: '1px solid rgb(211, 211, 211)' }}>
          <div className="d-flex justify-content-between align-items-center h-100 mx-4">
            <span style={{ fontSize: '12px', color: 'rgb(113, 113, 113)' }}>
              <i className="bi bi-telephone-fill"></i> Gọi đến số: 0342612107
            </span>

            <div className="d-flex mx-4 h-100" style={{ fontSize: '12px' }}>
              {isLoggedIn ? (
                <div className="d-flex justify-content-center align-items-center h-100">
                <div class=" dropdown-toggle h-100 d-flex align-items-center" data-bs-toggle="dropdown">
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
                    <li><Link to ={`/home/account/profile/${userId}`} class="dropdown-item">Thông tin cá nhân</Link></li>
                    <li><Link to = {`/home/account/order/${customerDetail.customerId}`} class="dropdown-item">Đơn hàng</Link></li>
                    <li><a class="dropdown-item" onClick={handleLogout}>Đăng xuất</a></li>
                </ul>
                <div className="d-flex justify-content-center align-items-center h-100 mx-2"><span style = {{fontSize:"16px", color: "blue"}}>{username}</span></div>
              </div>
              ) : (
                <div className = "h-100 d-flex align-items-center justify-content-center">
                  <Link to="/auth/register" className="h-100 text-decoration-none d-flex align-items-center" style={{ fontSize: '12px', color: 'rgb(113, 113, 113)' }}>Đăng ký</Link>
                  /
                  <Link to="/auth/login" className="h-100 text-decoration-none d-flex align-items-center" style={{ fontSize: '12px', color: 'rgb(113, 113, 113)' }}>Đăng nhập</Link>
                </div>
              )}
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mx-4 mt-3" style={{ height: '45px' }}>
            <Link to = "/home"  className="h-100 mx-4 d-flex align-items-center text-black text-decoration-none"><h4>ShopCloths</h4></Link>

            <div className="input-group" style={{ width: '60%', height: '100%' }}>
              <input type="text" className="form-control" placeholder="Search" aria-label="Search" 
              value={keyword}
              onChange={handleInputChange}
              />
              <Link to={`/home/search/${keyword}`} type="button" className="btn btn-primary">
                <i className="bi bi-search"></i>
              </Link>
            </div>

            <div className="d-flex flex-column align-items-center justify-content-end mx-3" style={{ height: '100%' }}>
              <Link to = '/home/favorite-product' className="position-relative text-black">
                <i className="bi bi-heart-fill text-danger" style={{ fontSize: '24px' }}></i>
                <span className="position-absolute badge rounded-pill bg-warning" style={{ fontSize: '8px', top: '1px', right: '-8px' }}>{favoriteProducts.length}</span>
              </Link>
              <p className="text-center m-0" style={{ fontSize: '10px' }}>Yêu thích</p>
            </div>

            <div className="d-flex flex-column align-items-center justify-content-end mx-3" style={{ height: '100%' }}>
              <Link to = "/home/my-cart" className="position-relative text-black">
                <i className="bi bi-cart" style={{ fontSize: '24px' }}></i>
                <span className="position-absolute badge rounded-pill bg-warning" style={{ fontSize: '8px', top: '1px', right: '-8px' }}>{cartItems.length}</span>
              </Link>
              <p className="text-center m-0" style={{ fontSize: '10px' }}>Giỏ hàng</p>
            </div>
          </div>
        </div>

        <div className="mt-3" style={{ height: '45px', width: '100%' }}></div>
        <div className="mt-2 d-flex justify-content-between align-items-center" style={{ height: '50px', width: '100%', backgroundColor: 'rgb(118, 118, 118)' }}>
          <div className="h-100">
            <div className="dropdown h-100">
              <button className="btn btn-warning dropdown-toggle h-100 mx-5 d-flex justify-content-between align-items-center" style={{ width: '250px', borderRadius: '0' }} type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="bi bi-list"></i> Danh mục
              </button>
              <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ width: '250px', borderRadius: '0' }}>
              {categories.map((category) => (
                <li key={category.id}>
                  <Link 
                    to="/home/product-filter"
                    className="dropdown-item"
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category.nameCategory}
                  </Link>
                </li>
              ))}
              </ul>
            </div>
          </div>

          <div className="h-100">
            <nav className="navbar navbar-expand-lg navbar-light h-100">
              <div className="container-fluid h-100">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                  <ul className="navbar-nav ms-auto">
                    <li className="nav-item">
                      <a className="nav-link active text-white" aria-current="page" href="#home">Trang chủ</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link text-white" href="#brand">Nhãn hàng</a>
                    </li>
                    <li className="nav-item">
                      <Link to = '/home/product-filter' className="nav-link text-white" href="#product">Sản phẩm</Link>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link text-white" href="#contact">Liên hệ</a>
                    </li>
                    <li className="nav-item">
                      <Link to = "/home/help" className="nav-link text-white">Hướng dẫn</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>

      <div style={{ height: '140px' }} id="home"></div>
    </>
  );
};

export default HeaderHome;
