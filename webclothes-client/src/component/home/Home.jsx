import React, { useEffect, useState } from 'react';
import slide1Image from '../img/home/slide1.jpg';
import slide2Image from '../img/home/slide2.jpg';
import slide3Image from '../img/home/slide3.png';
import nen1Image from '../img/home/nen1.jpg';
import nen2Image from '../img/home/nen2.jpg';
import voucher from '../img/home/voucher.png';
import { getAllBrands } from '../../api/Brand';
import { getAllProducts } from '../../api/Product';
import { Await, Link } from 'react-router-dom';
import { addFavoriteProduct, getAllFavorites, removeFavoriteProduct } from '../../api/FavoriteProduct';
import { toast } from 'react-toastify';
import { addCartItem } from '../../api/Cart';

const Home = () => {
  const[brands, setBrands] = useState([])

  const[products, setProducts] = useState([])
  const[errorMessage, setErrorMessage] = useState("")
  const[successMessage,setSuccessMessage] = useState("")
  const [currentProducts, setCurrentProducts] = useState([]);

  const [favoriteProducts, setFavoriteProducts] = useState([]);

  const [newCartItem, setNewCartItem] = useState({
    quantity: "1",
    size: "XL"
  });

  const handleBrandClick = (brand) => {
    if(localStorage.getItem('selectBrand') !== localStorage.setItem('selectBrand', brand.nameBrand)){
      localStorage.removeItem('selectCategory');
      localStorage.removeItem('selectBrand');
      localStorage.setItem('selectBrand', brand.nameBrand);
      console.error('Logout error:', localStorage.getItem('selectBrand'));
    } else{
      localStorage.setItem('selectBrand', brand.nameBrand);
    }
    
  };

  const handleNewCartItemClick = async (e, productId, quantity, size) =>{
    e.preventDefault()
    const cartId = localStorage.getItem('cartId')
    console.error("Mã giỏ hàng là:",cartId)

    try{
      if(cartId !== null){
        await addCartItem(cartId, productId, quantity, size);
        toast.success("Thêm vào giỏ hàng thành công!");
      }
    } catch(error){
      setErrorMessage(error.message);
    }
  }

  const handleFavoriteClick  = async (e, productId) => {
    e.preventDefault();
    const updatedFavorites = favoriteProducts.includes(productId)
      ? favoriteProducts.filter(id => id !== productId)
      : [...favoriteProducts, productId];
    setFavoriteProducts(updatedFavorites);

    try {

      if (updatedFavorites.includes(productId)) {
        await addFavoriteProduct(localStorage.getItem("id"), productId);
        toast.success("Thêm vào danh sách yêu thích thành công!");
      } else {
        await removeFavoriteProduct(localStorage.getItem("id"), productId);
        toast.success("Xóa khỏi danh sách yêu thích thành công!");
      }
      
      setSuccessMessage("Cập nhật danh sách yêu thích thành công!");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  useEffect(() =>{
    fetchBrands()
    fetchProducts()
    fetchFavorites()
},[])

useEffect(() => {
  if (products.length) {
    setCurrentProducts(getRandomProducts(products, numberOfProducts));
  }
}, [products]);

const fetchBrands = async () =>{
    const result = await getAllBrands();
    setBrands(result)
}

const fetchFavorites = async () =>{
  try {
    const result = await getAllFavorites(localStorage.getItem("id"));
    const ids = result.map(item => item.id);
    setFavoriteProducts(ids);
    console.error("Failed to fetch favorites:", favoriteProducts);
  } catch (error) {
    console.error("Failed to fetch favorites:", error);
  }
}
const fetchProducts = async () =>{
  try{
      const result = await getAllProducts()
      setProducts(result)
  }catch(error){
      setErrorMessage(error.message)
  }
}

const getRandomProducts = (products, numberOfProducts) => {
  // Trộn mảng sản phẩm
  const shuffled = [...products].sort(() => 0.5 - Math.random());

  // Lấy số sản phẩm yêu cầu
  return shuffled.slice(0, numberOfProducts);
};

const numberOfProducts = 16;


const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(value);
};

  return (
    <>
      <div className="d-flex mx-4 justify-content-between" style={{ zIndex: 10 }} id="brand">
        <div className="mt-4" style={{ width: '60%', height: '240px' }}>
          <div id="carouselExample" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img src={slide1Image} className="d-block w-100" alt="Slide 1" style = {{height:"240px", objectfit: "cover"}}/>
                <div className="carousel-caption d-none d-md-block">
                  <h5>Shop thời trang</h5>
                  <p>Đẹp là có, Sale hết ở shop</p>
                </div>
              </div>
              <div className="carousel-item">
                <img src={slide2Image}  className="d-block w-100" alt="Slide 2" style={{ height: "240px", objectFit: "cover" }}/>
                <div className="carousel-caption d-none d-md-block">
                  <h5>Miễn phí giao hàng</h5>
                  <p>Phí ship 0 đồng, nhanh tay nhanh tay</p>
                </div>
              </div>
              <div className="carousel-item">
                <img src={slide3Image} className="d-block w-100" alt="Slide 3" style={{ height: "240px", objectFit: "cover" }}/>
                <div className="carousel-caption d-none d-md-block">
                  <h5>Đảm bảo chất lượng</h5>
                  <p>Nhập khẩu uy tín, có kiểm chứng</p>
                </div>
              </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
            <div className="carousel-indicators">
              <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
              <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="1" aria-label="Slide 2"></button>
              <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>
          </div>
        </div>
        <div className="d-flex flex-column align-items-center mt-4" style={{ width: '39%', height: '240px' }}>
          <img src={nen1Image} className="d-block w-100" alt="Slide 3" style={{ height: '117px',objectFit: "cover"  }} />
          <img src={nen2Image} className="d-block w-100 mt-1" alt="Slide 3" style={{ height: '117px',objectFit: "cover"  }} />
        </div>
      </div>

      <div className="mx-4 mt-3 bg-white py-3">
        <div className="mt-3 mx-3">
          <h4 style={{ color: 'rgb(255, 174, 0)' }}>Danh sách nhãn hàng</h4>
          <div className="my-3 d-flex" style = {{overflowX: 'scroll', msOverflowStyle: 'none', scrollbarWidth: 'none'}}>
          {brands.map((brand) => (
            <Link to = "/home/product-filter" className="col-2 mt-1 h-100" key={brand.id} style = {{textDecoration :'none'}}  onClick={() => handleBrandClick(brand)}>
              <div className="mx-2" style={{ border: '1px solid rgb(176, 176, 176)', height:'120px'}}>
                <div style = {{height:'90px'}}>
                  {brand.imageBrand && (
                      <img
                        src={`data:image/jpeg;base64,${brand.imageBrand}`}
                        alt={`Photo of ${brand.imageBrand}`}
                        style={{ width: '100%', height: '90px' }}
                      />
                  )}
                </div>
                <div className="mx-2 text-center" style = {{height:'30px'}}>
                  <p className = "text-black">{brand.nameBrand}</p>
                </div>
              </div>
            </Link>

          ))}
          
          </div>
        </div>
      </div>

      <div className="mx-4 mt-3" style={{ height: '300px' }} id="product">
        <img src={voucher} style={{ width: '100%', height: '100%' }} alt="Product" />
      </div>

      <div className="mx-4 mt-3">
        <div className="d-flex justify-content-center align-items-center w-100 bg-white" style={{ height: '60px', borderBottom: '5px solid rgb(255, 174, 0)' }}>
          <h4 style={{ color: 'rgb(255, 174, 0)' }}>Gợi ý hôm nay</h4>
        </div>
        <div className="row">
          
          {currentProducts.map((product) => (
          <div className="col-3 mt-2" key={product.productId}>
            <div className="d-flex flex-column align-items-center">
              <div className="position-relative bg-white w-100" style={{ height: '350px' }}>
                <Link to={`/home/product-detail/${product.productId}`}   className="h-100 w-100">
                  {product.imageProduct && (
                    <img
                    src={`data:image/jpeg;base64,${product.imageProduct}`}
                    alt={`Photo of ${product.imageProduct}`}
                    style={{ width: '100%', height: '100%',objectFit: "cover"  }}
                    />
                  )}
                </Link>
                {product.disCount !== 0 ? <span className="position-absolute bg-danger text-white" style={{ right: '0px', top: '0px' }}>Giảm {product.disCount} %</span> : ''}
                <button className={`favorite-button ${favoriteProducts.includes(product.productId) ? 'favorited' : ''}`}
                    onClick={(e) => handleFavoriteClick(e, product.productId)}
                 style={{position: 'absolute', left: '20px', top: '10px', fontSize:'25px', backgroundColor: 'transparent', border: 'none' }}><i class="bi bi-heart-fill" style={{ color: favoriteProducts.includes(product.productId) ? 'red' : 'white' }}></i></button>
              </div>
              <div className="w-100">
                <div className="w-100 d-flex flex-column justify-content-center align-items-center bg-white">
                  <Link to={`/home/product-detail/${product.productId}`}  className="mt-2" style={{ fontSize: '16px', fontWeight: 'bold', textDecoration: 'none' }}>{product.name}</Link>
                  <div>
                    <span className="bi bi-star-fill" style = {{color:'orange'}}></span>
                    <span className="bi bi-star-fill" style = {{color:'orange'}}></span>
                    <span className="bi bi-star-fill" style = {{color:'orange'}}></span>
                    <span className="bi bi-star-fill"></span>
                    <span className="bi bi-star-fill"></span>
                  </div>
                  <div className="d-flex justify-content-between mt-2">
                    <div className="mx-1">
                      <p className="product-price">
                        <del>{formatCurrency(product.price)}</del>
                      </p>
                    </div>
                    <div className="mx-1">
                      <div className="bg-warning">
                        <p className="text-white">{formatCurrency((product.price - (product.price * (product.disCount/100))))}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col pb-3" onClick={(e) => handleNewCartItemClick(e, product.productId, newCartItem.quantity, newCartItem.size)}>
                    <button className="btn btn-primary"><i className="bi bi-cart3"></i> Thêm vào giỏ hàng</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          ))}

          
        </div>
        <div className="text-center mt-5">
          <Link to = "/home/product-filter" className="btn btn-primary px-3">Xem thêm</Link>
        </div>
      </div>

      <div className="mt-5" style={{ backgroundColor: 'rgb(255, 174, 0)', height: '5px' }}></div>
    </>
  );
}

export default Home;
