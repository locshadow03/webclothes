import React, { useEffect, useState } from 'react'
import { getAllSearchProduct } from '../../api/Product'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { addFavoriteProduct, getAllFavorites, removeFavoriteProduct } from '../../api/FavoriteProduct'
import ProductPaginator from '../common/ProductPaginator'

const ProductSearch = () => {
    const[products, setProducts] = useState([])
    const[successMessage,setSuccessMessage] = useState("")
    const[errorMessage, setErrorMessage] = useState("")
    const[currentPage, setCurrenPage] = useState(1)
    const[productsPerPage] = useState(8)
    const {keyword} = useParams()

    const [favoriteProducts, setFavoriteProducts] = useState([]);


    const fetchProducts = async () =>{
        try{
            const result = await getAllSearchProduct(keyword)
            setProducts(result)
        }catch(error){
            setErrorMessage(error.message)
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


    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
          minimumFractionDigits: 0,
        }).format(value);
      };

      useEffect(() =>{
        fetchFavorites()
    },[])

    useEffect(() =>{
        fetchProducts()
    },[keyword])

    const handlePaginationClick = (pageNumber) =>{
        setCurrenPage(pageNumber)
    }

    const calculateTotalPages = (productsPerPage, products) =>{
        const totalProducts = products.length
        return Math.ceil(totalProducts / productsPerPage)
    } 
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  return (
    <>
        <div className='mx-5 mt-5 py-4'>
            <div className='row'>
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
        <ProductPaginator currentPage={currentPage} totalPages={calculateTotalPages(productsPerPage, products)}
            onPageChange={handlePaginationClick}/>
    </>
  )
}

export default ProductSearch
