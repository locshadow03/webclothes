import React, { useEffect, useState } from 'react'
import { getProductById } from '../../api/Product'
import { Link, useParams } from 'react-router-dom'
import { addFavoriteProduct, getAllFavorites, removeFavoriteProduct } from '../../api/FavoriteProduct'
import { toast } from 'react-toastify'
import { addCartItem } from '../../api/Cart'

const ProductDetail = () => {
    const [product, setProduct] = useState({
        name:"",
        code:"",
        nameCategory:"",
        description:"",
        price:"",
        sizeQuantities: [],
        nameBrand:"",
        disCount:"",
        imageProduct: ""

    })
    const paragraphs = product.description.split('-');
    const [quantity, setQuantity] = useState(1)

    const [selectedSize, setSelectedSize] = useState({});
    const [favoriteProducts, setFavoriteProducts] = useState([]);
    const[errorMessage, setErrorMessage] = useState("")
    const[successMessage,setSuccessMessage] = useState("")

    const fetchFavorites = async () =>{
      try {
        const result = await getAllFavorites(localStorage.getItem("id"));
        const ids = result.map(item => item.id);
        setFavoriteProducts(ids)
        console.error("Failed to fetch favorites:", favoriteProducts);
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
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



    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
          minimumFractionDigits: 0,
        }).format(value);
      };

      const handleSizeChange = (productId, size) => {
        setSelectedSize(prevState => ({ ...prevState, [productId]: size }));
    };

    const handleNewCartItemClick = async (e, productId, quantity, size) =>{
      e.preventDefault()
      const cartId = localStorage.getItem('cartId')
      try {
        await addCartItem(cartId, productId, quantity, size);
          toast.success("Thêm vào giỏ hàng thành công!");
      } catch (error) {
          toast.error("Thêm vào giỏ hàng thất bại!");
      }
  };


    const increaseQuantity = () => {
      setQuantity(prevQuantity => prevQuantity + 1);
    };

    const decreaseQuantity = () => {
      setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
    };

    const [imagePreview, setImagePreview] = useState("")
    const {productId} = useParams()
    useEffect(() => {
        const fetchProducts = async () => {
          try {
            const productData = await getProductById(productId)
            setProduct(productData)
            
            setImagePreview(`data:image/jpeg;base64,${productData.imageProduct}`)
          } catch (error) {
            console.error(error)
          }
        }
        fetchProducts ()
        fetchFavorites()
      }, [productId])

      const selectedProductSize = selectedSize[product.productId] || (product.sizeQuantities.length > 0 ? product.sizeQuantities[0].size : "");
  return (
    <>
        <div className = "container-fluid mx-2 mt-4" style = {{borderBottom : "1px solid rgba(0, 0 , 0 ,0.2)"}}>
            <div className = 'mb-2'>
                <Link to = "/home" style = {{textDecoration:'none', color:'#808080'}}>Trang chủ &gt; </Link>
                <Link to = "/home" style = {{textDecoration:'none', color:'#808080'}}>Sản phẩm &gt; </Link>
                <Link to = "/home" style = {{textDecoration:'none', color:'#808080'}}>Chi tiết sản phẩm</Link>
            </div>
        </div>
        <div className="container mt-4 mb-2">
        <div className="row" key = "productId">
          <div className="col-md-6" style = {{height:'850px'}}>
            <div className = "w-100 position-relative h-100">
            <div className="h-100 w-100">
                {product.imageProduct && (
                <img
                src={`data:image/jpeg;base64,${product.imageProduct}`}
                alt={`Photo of ${product.imageProduct}`}
                style={{ width: '100%', height: '100%',objectFit: "cover"  }}
                />
                  )}
            </div>
            {product.disCount !== 0 ? <span className="position-absolute bg-danger text-white" style={{ left: '0px', top: '0px' }}>Giảm {product.disCount} %</span> : ''}
          </div>
          </div>
          <div className = 'col-md-6'>
          <div className="" style = {{boxShadow: '0 4px 4px -2px rgba(0, 0, 0, 0.1)'}}>
            <h2>{product.name}</h2>
            <p className="text-muted">Mã Sản Phẩm: {product.code}</p>
            <div className="d-flex justify-content-between">
                <div className="mx-1 d-flex">
                    <p className="product-price">
                    <del style = {{fontSize:'20px'}}>{formatCurrency(product.price)}</del>
                    </p>
                    <p className="text-danger mx-3" style = {{fontSize:'20px'}}>{formatCurrency((product.price - (product.price * (product.disCount/100))))}</p>
                </div>
            </div>
            <p><strong>Danh Mục:</strong> {product.nameCategory}</p>
            <p><strong>Thương Hiệu:</strong> {product.nameBrand}</p>
            {/* <p><strong>Mô Tả:</strong> Đây là mô tả chi tiết của sản phẩm. Nó bao gồm các thông tin về chất liệu, kích thước, và các đặc điểm nổi bật khác.</p> */}
            
            <p className = 'd-flex align-items-center'><strong>Kích Thước:</strong>
            <select
                value={selectedProductSize}
                onChange={(e) => handleSizeChange(product.productId, e.target.value)}
                className="form-select text-center mx-3"
                style={{width: '100px', height: '35px',fontSize: '13px'}}
            >
                {product.sizeQuantities.map((sizeQuantity) => (
                    <option key={sizeQuantity.id} value={sizeQuantity.size} style={{ fontSize: '13px' }}>
                        {sizeQuantity.size}
                    </option>
                ))}
            </select>        
            </p>
            <p><strong>Số Lượng Còn Lại:</strong> {product.sizeQuantities.find(sizeQuantity => sizeQuantity.size === selectedProductSize)?.quantity || 0}</p>
            <div>
                <span className="bi bi-star-fill" style = {{color:'orange'}}></span>
                <span className="bi bi-star-fill" style = {{color:'orange'}}></span>
                <span className="bi bi-star-fill" style = {{color:'orange'}}></span>
                <span className="bi bi-star-fill"></span>
                <span className="bi bi-star-fill"></span>
            </div>
            <div className="d-flex align-items-center mt-3">
              <button className="btn btn-outline-primary" onClick={decreaseQuantity}>-</button>
              <input
                  type="text"
                  value={quantity}
                  readOnly
                  className="form-control mx-2 text-center"
                  style={{ width: '50px' }}
              />
              <button className="btn btn-outline-primary" onClick={increaseQuantity}>+</button>
            </div>
            <div className = 'mt-5 d-flex align-items-center pb-3 '>
                <button className=" mx-1 btn btn-primary" onClick={(e) => handleNewCartItemClick(e, product.productId, quantity, selectedProductSize)}>Thêm vào giỏ hàng</button>
                <button className={`mx-4 d-flex align-items-center favorite-button ${favoriteProducts.includes(product.productId) ? 'favorited' : ''}`}
                    onClick={(e) => handleFavoriteClick(e, product.productId)}
                 style={{fontSize:'25px', backgroundColor: 'transparent', border: 'none' }}><i class="bi bi-heart-fill mx-2" style={{ color: favoriteProducts.includes(product.productId) ? 'red' : 'white' }}></i><p className = 'text-black m-0'>Yêu thích</p></button>
            </div>
          </div>
          <div className = "d-flex align-items-center justify-content-end mt-3">
            <p className= 'mx-2 mb-0'>Chia sẻ</p>
            <div className="">
              <a href="#!" className="text-dark mx-1"><i className="bi bi-facebook"></i></a>
              <a href="#!" className="text-dark mx-1"><i className="bi bi-twitter"></i></a>
              <a href="#!" className="text-dark mx-1"><i className="bi bi-instagram"></i></a>
              <a href="#!" className="text-dark mx-1"><i className="bi bi-linkedin"></i></a>
            </div>
          </div>
          </div>
        </div>

        <div className="card mt-3">
            <div className="card-header">
                <h4>Mô tả sản phẩm</h4>
            </div>
            <div className="card-body">
                {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph.trim()}</p>
                ))}
            </div>
        </div>


      </div>
    </>
  )
}

export default ProductDetail
