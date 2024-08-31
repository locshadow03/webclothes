import React, { useEffect, useState } from 'react'
import { getAllCategores } from '../../api/Category'
import { getAllBrands } from '../../api/Brand'
import { getAllProducts } from '../../api/Product'
import { Link } from 'react-router-dom'
import ProductPaginator from '../common/ProductPaginator'
import { addFavoriteProduct, getAllFavorites, removeFavoriteProduct } from '../../api/FavoriteProduct'
import { toast } from 'react-toastify'

const ProductFilter = () => {
    const[categories, setCategories] = useState([])
    const[brands, setBrands] = useState([])
    const[products, setProducts] = useState([])
    const[currentPage, setCurrenPage] = useState(1)
    const[productsPerPage] = useState(6)
    const[errorMessage, setErrorMessage] = useState("")
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [sortOption, setSortOption] = useState('');
    const[successMessage,setSuccessMessage] = useState("")
    const [favoriteProducts, setFavoriteProducts] = useState([]);

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };


    const filteredProducts = products.filter(product => {
        return (
            (!selectedCategory || product.nameCategory === selectedCategory) &&
            (!selectedBrand || product.nameBrand === selectedBrand)
        );
    });

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

    

    useEffect(() =>{
        // const selecttCategory = localStorage.getItem('selectCategory');
        setSelectedCategory(localStorage.getItem('selectCategory'))
        setSelectedBrand(localStorage.getItem('selectBrand'))
        fetchCategorys()
        fetchBrands()
        fetchProducts()
        fetchFavorites()
    },[])

    const fetchCategorys = async () =>{
        const result = await getAllCategores()
        setCategories(result)
    }
    const fetchBrands = async () =>{
        const result = await getAllBrands();
        setBrands(result)
    }

    const fetchProducts = async () =>{
        try{
            const result = await getAllProducts()
            setProducts(result)
        }catch(error){
            setErrorMessage(error.message)
        }
      }

      const calculateTotalPages = (productsPerPage, products) =>{
        const totalProducts = products.length
        return Math.ceil(totalProducts / productsPerPage)
    }
    const handlePaginationClick = (pageNumber) =>{
        setCurrenPage(pageNumber)
    }

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        const priceA = a.price * (1 - a.disCount / 100);
        const priceB = b.price * (1 - b.disCount / 100);
        if (sortOption === 'Tên sản phẩm') {
            return a.name.localeCompare(b.name);
        } else if (sortOption === 'Giá tiền') {
            return priceA - priceB;
        } else if (sortOption === 'Giảm giá') {
            return b.disCount - a.disCount;
        } else if (sortOption === 'Lượt xem') {
            return b.viewCount - a.viewCount;
        }
        return 0;

    });

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category.nameCategory);
        localStorage.removeItem('selectCategory');
        localStorage.removeItem('selectBrand');
        setSelectedBrand("")
        setCurrenPage(1);
    };

    const handleBrandClick = (brand) => {
        setSelectedBrand(brand.nameBrand);
        localStorage.removeItem('selectCategory');
        localStorage.removeItem('selectBrand');
        setSelectedCategory("")
        setCurrenPage(1);
    };

    const handleClear = () => {
        localStorage.removeItem('selectCategory');
        localStorage.removeItem('selectBrand');
        setSelectedCategory("")
        setSelectedBrand("")
        setCurrenPage(1);
    };
    
    const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
    }).format(value);
    };

  return (
    <>
    <div className = "container mt-3 py-4"  style = {{overflow: "hidden"}}>
    <div className = "row">
        <div className= "col-3"  style = {{border: "1px solid rgba(0, 0, 0, 0.1)"}}>
            <div className = "d-flex justify-content-between align-items-center w-100 py-2" style = {{borderBottom: "1px solid rgba(0, 0, 0, 0.1)"}}>
                <h5 className = "m-0">Lọc</h5>
                <a className = "m-0" href='#' style = {{textDecoration : "none", color : "red"}} onClick={handleClear}>Xóa bộ lọc</a>
            </div>

            <div className = "">
                <ul className="nav d-flex flex-column"  style = {{overflow: "hidden"}}>
                    <li className="nav-item">
                        <a className="nav-link text-black" href="#collapseOne" data-bs-toggle="collapse"><i className="bi bi-list-stars mx-2" style = {{color: "blue"}}></i>Danh mục sản phẩm</a>
                    </li>
                    <div id="collapseOne" className="collapse show" data-bs-parent="#accordion">
                    <ul className="nav d-flex flex-column text-start mx-3">
                        {categories.map((category) => (
                        <li className="nav-item" key={category.id} >
                            <a className={`nav-link ${selectedCategory === category.nameCategory ? 'text-primary' : 'text-warning'}`} href="#" onClick={() => handleCategoryClick(category)}>{category.nameCategory}</a>
                        </li>
                        ))}
                    </ul>
                    </div>
                    <li className="nav-item">
                        <a className="nav-link text-black" href="#collapseTwo" data-bs-toggle="collapse"><i className="bi bi-list-ul mx-2" style = {{color: "blue"}}></i>Danh Sách nhãn hàng</a>
                    </li>
                    <div id="collapseTwo" className="collapse show" data-bs-parent="#accordion">
                    <ul className="nav d-flex flex-column text-start mx-3">
                        {brands.map((brand) => (
                        <li className="nav-item" key={brand.id} >
                            <a className={`nav-link ${selectedBrand === brand.nameBrand ? 'text-primary' : 'text-warning'}`} href="#" onClick={() => handleBrandClick(brand)}>{brand.nameBrand}</a>
                        </li>
                        ))}
                    </ul>
                    </div>
                </ul>
            </div>
        </div>

        <div className = "col-9">
            <div className="d-flex justify-content-end align-items-center py-2">
                <p className="mx-2 m-0">Sắp xếp theo</p>
                <select className="px-4 py-1" style={{ color: "#808080", border: "#808080" }} onChange={handleSortChange}>
                    <option value="">Chọn</option>
                    <option value="Tên sản phẩm">Tên sản phẩm</option>
                    <option value="Giá tiền">Giá tiền tăng dần</option>
                    <option value="Giảm giá">Mã giảm giá giảm dần</option>
                    <option value="Lượt xem">Lượt xem giảm dần</option>
                </select>
        </div>

            <div className = "row">
            {currentProducts.map((product) => (
                <div className="col-4 mt-2" key={product.productId}>
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
    </div>
    <div className = "row">
        <div className = "col-3">

        </div>
        <div className = "col-9 text-center">
        <ProductPaginator currentPage={currentPage} totalPages={calculateTotalPages(productsPerPage, products)}
            onPageChange={handlePaginationClick} />
        </div>
    </div>
    </div>


    
    </>
  )
}

export default ProductFilter
