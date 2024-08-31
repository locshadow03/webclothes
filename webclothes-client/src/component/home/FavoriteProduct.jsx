import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { addFavoriteProduct, getAllFavorites, removeFavoriteProduct } from '../../api/FavoriteProduct';
import { toast } from 'react-toastify';

const FavoriteProduct = () => {
    const[allFavoriteProducts, setAllFavoriteProducts] = useState([]);
    const [currentProducts, setCurrentProducts] = useState([]);
    const [favoriteProducts, setFavoriteProducts] = useState([]);
    const[errorMessage, setErrorMessage] = useState("")
    const[successMessage,setSuccessMessage] = useState("")

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

    const fetchFavorites = async () =>{
        try {
          const result = await getAllFavorites(localStorage.getItem("id"));
          const ids = result.map(item => item.id);
          setFavoriteProducts(ids);
          setAllFavoriteProducts(result)
          console.error("Failed to fetch favorites:", favoriteProducts);
        } catch (error) {
          console.error("Failed to fetch favorites:", error);
        }
      }

    useEffect(() =>{
        fetchFavorites()
    },[])

    useEffect(() => {
        if (allFavoriteProducts.length) {
          setCurrentProducts(getRandomProducts(allFavoriteProducts, numberOfProducts));
        }
      }, [allFavoriteProducts]);

      const getRandomProducts = (allFavoriteProducts, numberOfProducts) => {
        // Trộn mảng sản phẩm
        const shuffled = [...allFavoriteProducts].sort(() => 0.5 - Math.random());
      
        // Lấy số sản phẩm yêu cầu
        return shuffled.slice(0, numberOfProducts);
      };
      
      // Ví dụ sử dụng
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
        <div className = "container-fluid mx-4 mt-4" style = {{borderBottom : "1px solid rgba(0, 0 , 0 ,0.2)"}}>
            <div className = 'mb-2'>
                <Link to = "/home" style = {{textDecoration:'none', color:'#808080'}}>Trang chủ &gt; </Link>
                <Link to = "/home" style = {{textDecoration:'none', color:'#808080'}}>Sản phẩm yêu thích</Link>
            </div>
        </div>

        <div className='container py-4'>
        <div className="row">
          {/* Product suggestions */}
          {currentProducts.map((product) => (
          <div className="col-3 mt-2" key={product.id}>
            <div className="d-flex flex-column align-items-center">
              <div className="position-relative bg-white w-100" style={{ height: '350px' }}>
                <Link to={`/home/product-detail/${product.id}`}   className="h-100 w-100">
                  {product.productImage && (
                    <img
                    src={`data:image/jpeg;base64,${product.productImage}`}
                    alt={`Photo of ${product.productImage}`}
                    style={{ width: '100%', height: '100%',objectFit: "cover"  }}
                    />
                  )}
                </Link>
                {product.disCount !== 0 ? <span className="position-absolute bg-danger text-white" style={{ right: '0px', top: '0px' }}>Giảm {product.disCount} %</span> : ''}
                <button className={`favorite-button ${favoriteProducts.includes(product.id) ? 'favorited' : ''}`}
                    onClick={(e) => handleFavoriteClick(e, product.id)}
                 style={{position: 'absolute', left: '20px', top: '10px', fontSize:'25px', backgroundColor: 'transparent', border: 'none' }}><i class="bi bi-heart-fill" style={{ color: favoriteProducts.includes(product.id) ? 'red' : 'white' }}></i></button>
              </div>
              <div className="w-100">
                <div className="w-100 d-flex flex-column justify-content-center align-items-center bg-white">
                  <Link to={`/home/product-detail/${product.id}`}  className="mt-2" style={{ fontSize: '16px', fontWeight: 'bold', textDecoration: 'none' }}>{product.productName}</Link>
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
                  <div className="col pb-3">
                    <button className="btn btn-primary"><i className="bi bi-cart3"></i> Thêm vào giỏ hàng</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          ))}
        </div>
        </div>
    
    </>
  )
}

export default FavoriteProduct
