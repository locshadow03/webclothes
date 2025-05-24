import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaEdit, FaEye, FaTrashAlt} from 'react-icons/fa';
import { deleteProduct, getAllProducts, getProductById } from '../../../api/Product';
import ProductPaginator from '../../common/ProductPaginator';
import { toast } from 'react-toastify';

const AllProducts = () => {
    const[products, setProducts] = useState([])
    const[currentPage, setCurrenPage] = useState(1)
    const[productsPerPage] = useState(8)
    const[errorMessage, setErrorMessage] = useState("")
    const[successMessage, setSuccessMessage] = useState("")
    const [productDetail, setProductDetail] = useState("");

    const [selectedSize, setSelectedSize] = useState({});
    
    const[selectedColor, setSelectedColor] = useState({});
    const[quantity, setQuantity] = useState({})

    
    const handleViewDetail = async (productId) => {
        try {
            const productData = await getProductById(productId);
            const defaultSize = productData.sizeQuantities.length > 0 ? productData.sizeQuantities[0].size : "";
            const defaultColor = productData.sizeQuantities.length > 0 && productData.sizeQuantities[0].colorImageProductDtos.length > 0 ? productData.sizeQuantities[0].colorImageProductDtos[0].color : "";
            console.log('Hiển thị ', productData.sizeQuantities[0].colorImageProductDtos[0].color);
            setSelectedSize({[productId]: defaultSize});
            setSelectedColor({[productId]: defaultColor});
            setProductDetail(productData);
        } catch (error) {
            console.error('Error fetching product detail:', error);
            setErrorMessage('Error fetching product detail');
        }
    };

    useEffect(() =>{
        fetchProducts()
    },[])

    const fetchProducts = async () =>{
        try{
            const result = await getAllProducts()
            setProducts(result)
            
        }catch(error){
            setErrorMessage(error.message)
        }
    }


    const handleDelete = async(productId) =>{
        try{
            const result = await deleteProduct(productId)
            if(result === ""){
                setSuccessMessage(`Product no ${productId} was delete`)
                fetchProducts()
                toast.success("Xóa sản phẩm thành công!")
            } else{
                console.error(`Error deleting product: ${result.message}`)
            }
        }catch(error){
            setErrorMessage(error.message)
        }

        setTimeout(() => {
            setSuccessMessage("")
            setErrorMessage("")
        }, 3000)
    }

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

    const handleSizeChange = (product, productId, size) => {
        setSelectedSize(prevState => ({ ...prevState, [productId]: size }));
        setSelectedColor(prevState => ({...prevState, [productId]: (product.sizeQuantities.length > 0 && product.sizeQuantities[0].colorImageProductDtos.length > 0 ? product.sizeQuantities[0].colorImageProductDtos[0].color : "")}))
        setQuantity(prevState => ({...prevState, [productId]:  (product.sizeQuantities.find(sizeQuantity => sizeQuantity.size === size)?.colorImageProductDtos[0] || 0)?.quantity || 0}))
         
    };

    const handleColorChange = (product, productId, color) => {
        setSelectedColor(prevState => ({...prevState, [productId]: color}));
        setQuantity(prevState => ({...prevState, [productId]: (product.sizeQuantities.find(sizeQuantity => sizeQuantity.size === selectedSize[product.productId])?.colorImageProductDtos || []).find(colorProduct => colorProduct.color === selectedColor[product.productId] )?.quantity || 0}))
    }

    

  return (
    <>
            {successMessage && (
                <div className="alert alert-success mx-5 mt-5" role="alert">
                    {successMessage}
                </div>
            )}

            {errorMessage && (
                <div className="alert alert-danger mx-5 mt-5" role="alert">
                    {errorMessage}
                </div>
            )}

        <div className="mx-1 mt-2 pb-2" style={{ background: "linear-gradient(to left, rgb(231, 243, 254) 0%, rgb(226, 241, 252) 45%)", borderRadius: "10px" }}>
            <div className = "pb-2" style={{borderBottom: "1px solid rgb(214, 215, 216)"}}>
            <div className='d-flex justify-content-between align-content-center mt-5 mx-4'>
              <div className='mt-2'>
                <h4>Danh sách sản phẩm</h4>
              </div>
              <Link to = {"/dashboard/product/add/new-product"} className = "btn btn-primary mt-2">
                Add product
              </Link>
            </div>
            </div>
        
      <div className = "mx-2 mt-1">
        <table className='table table-hover mt-2' style={{ marginBottom: "0" }}>
            <thead>
                <tr>
                    <th className = "align-content-center"><p className='fw-bold'>Tổng số sản phẩm: {products.length}</p></th>
                    <th></th>
                </tr>
            </thead>
        </table>
      <table className='table table-hover' style = {{boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', marginTop: "0"}}>
                <thead>
                    <tr className='text-center'>
                        <th>ID</th>
                        <th>Tên sản phẩm</th>
                        <th>Giá sản phẩm</th>
                        <th>Ảnh sản phẩm</th>
                        <th>Phiếu giảm giá</th>
                        <th>Tình trạng</th>
                        <th>Size</th>
                        <th>Màu sắc</th>
                        <th>Số lượng</th>
                        <th>Lượt xem</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>

                {currentProducts.map((product, index) => {
                            // Default selected size for this product
                            const selectedProductSize = selectedSize[product.productId] || (product.sizeQuantities.length > 0 ? product.sizeQuantities[0].size : "");
                            const selectedProductColor = selectedColor[product.productId] || (product.sizeQuantities.length > 0 && product.sizeQuantities[0].colorImageProductDtos.length > 0 ? product.sizeQuantities[0].colorImageProductDtos[0].color : "");
                            const quantityNew = (product.sizeQuantities.find(sizeQuantity => sizeQuantity.size === (selectedSize[product.productId]|| selectedProductSize))?.colorImageProductDtos || []).find(colorProduct => colorProduct.color === (selectedColor[product.productId] || selectedProductColor))?.quantity || 0;
                            console.log("selectedColor:", selectedColor);
                            console.log("Product ID:", product.productId);
                            console.log("selectedColor[product.productId]:", selectedProductColor);

                            return (
                                <tr key={product.productId} className='text-center'>
                                    <td>{index + 1}</td>
                                    <td>{product.name}</td>
                                    <td>{product.price}</td>
                                    <td>
                                        {product.imageProduct && (
                                            <img
                                                src={product.imageProduct}
                                                alt={`Photo of ${product.imageProduct}`}
                                                style={{ width: '40px', height: '35px' }}
                                            />
                                        )}
                                    </td>
                                    <td className="text-danger">
                                        {product.disCount}
                                        {product.percentage ? '%' : 'VND'}
                                    </td>
                                    <td>
                                        <span style={{ fontSize: '12px', color: 'white', backgroundColor: product.disCount !== 0 ? 'red' : 'green', padding: '2px 5px', borderRadius: '3px', fontWeight: 'bold' }}>
                                            {product.disCount !== 0 ? 'Đang giảm giá' : 'Không có giảm giá'}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            value={selectedSize[product.productId] || selectedProductSize }
                                            onChange={(e) => handleSizeChange(product, product.productId, e.target.value)}
                                            className="form-select text-center"
                                            style={{ height: '35px',fontSize: '13px'}}
                                        >
                                            {product.sizeQuantities.map((sizeQuantity) => (
                                                <option key={sizeQuantity.id} value={sizeQuantity.size} style={{ fontSize: '13px' }}>
                                                    {sizeQuantity.size}
                                                </option>
                                            ))}
                                        </select>
                                    </td>

                                    <td>
                                        <select
                                            value={selectedColor[product.productId] || selectedProductColor}
                                            onChange={(e) => handleColorChange(product, product.productId, e.target.value)}
                                            className="form-select text-center"
                                            style={{height: '35px', fontSize: '13px'}}
                                        >
                                            {(product.sizeQuantities.find(sq => sq.size === (selectedSize[product.productId] || selectedProductSize))?.colorImageProductDtos || [])
                                            .map((colorProduct) => (
                                                <option key={colorProduct.id} value={colorProduct.color} style={{fontSize: '13px'}}>
                                                    {colorProduct.color}
                                                </option>
                                            ))
                                            }

                                        </select>
                                    </td>

                                    <td>
                                        {quantityNew || quantity[product.productId]}
                                    </td>

                                    <td>{product.viewCount}</td>
                                    <td className='gap-2'>
                                        <button
                                            className='btn btn-primary btn-sm mx-2'
                                            data-bs-toggle="modal"
                                            data-bs-target="#myModal"
                                            onClick={() => handleViewDetail(product.productId)}
                                        >
                                            <FaEye />
                                        </button>
                                        <Link to={`/dashboard/product/update/${product.productId}`}>
                                            <span className='btn btn-warning btn-sm mx-2'>
                                                <FaEdit />
                                            </span>
                                        </Link>
                                        <button
                                            className='btn btn-danger btn-sm mx-2'
                                            onClick={() => handleDelete(product.productId)}
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

      <ProductPaginator currentPage={currentPage} totalPages={calculateTotalPages(productsPerPage, products)}
            onPageChange={handlePaginationClick} />

     <div class="modal" id="myModal">
                <div class="modal-dialog modal-xl modal-dialog-centered">
                <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">Thông tin sản phẩm</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                <form className = "mx-5 mt-2">
                    <div className='mb-3'>
                            <div className='mb-3'>
                                <label htmlFor='nameProduct' className='form-lable'>Name product</label>
                                <input id="nameProduct" name="nameProduct" type="text" className='form-control' value={productDetail ? productDetail.name : ''} readOnly
                                />
                            </div>

                            <div className='mb-3'>
                                <label htmlFor='codeProduct' className='form-lable'>Code product</label>
                                <input id="codeProduct" name="codeProduct" type="text" className='form-control' value={productDetail ? productDetail.code : ''} readOnly
                                />
                            </div>

                            <div className='mb-3'>
                                <label htmlFor='categoryProduct' className='form-lable'>Category product</label>
                                <input id="categoryProduct" name="categoryProduct" type="text" className='form-control' value={productDetail ? productDetail.nameCategory : ''} readOnly
                                />
                            </div>

                            <div className='mb-3'>
                                <label htmlFor='description' className='form-lable'>Description</label>
                                <input id="description" name="description" type="text" className='form-control' value={productDetail ? productDetail.description : ''} readOnly
                                />
                            </div>

                            <div className='mb-3'>
                                <label htmlFor='price' className='form-lable'>Price</label>
                                <input id="price" name="price" type="text" className='form-control' value={productDetail ? productDetail.price : ''} readOnly
                                />
                            </div>

                            <div className='mb-3'>
                                <label htmlFor='disCount' className='form-lable'>Phiếu giảm giá</label>
                                <input id="disCount" name="disCount" type="text" className='form-control' value={productDetail ? `${productDetail.disCount}%` : ''} readOnly
                                />
                            </div>

                            <div className='mb-3'>
                                <label htmlFor='viewCount' className='form-lable'>Lượt xem</label>
                                <input id="viewCount" name="viewCount" type="text" className='form-control' value={productDetail ? productDetail.viewCount : ''} readOnly
                                />
                            </div>

                            <div className='mb-3'>
                                <label htmlFor='nameBrand' className='form-lable'>Name Brand</label>
                                <input id="nameBrand" name="nameBrand" type="text" className='form-control' value={productDetail ? productDetail.nameBrand : ''} readOnly
                                />
                            </div>

                            <div className='mb-3'>
                                        <label htmlFor='sizeQuantity' className='form-lable'>Size và Số lượng</label>
                                        {productDetail.sizeQuantities && productDetail.sizeQuantities.length > 0 ? (
                                            <table className='table table-bordered'>
                                                <thead>
                                                    <tr>
                                                        <th>Size</th>
                                                        <th>Màu sắc</th>
                                                        <th>Số lượng</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {productDetail.sizeQuantities.map((sizeQuantity, sizeIndex) =>
                                                    sizeQuantity.colorImageProductDtos.map((colorProduct, colorIndex) => (
                                                        <tr key={`${sizeIndex}-${colorIndex}`}>
                                                            {colorIndex === 0 && (
                                                                <td rowSpan={sizeQuantity.colorImageProductDtos.length}>
                                                                    {sizeQuantity.size}
                                                                </td>
                                                            )}
                                                            <td>{colorProduct.color}</td>
                                                            <td>{colorProduct.quantity}</td>
                                                        </tr>
                                                    ))
                                                )}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <p>Không có thông tin kích thước và số lượng.</p>
                                        )}
                                    </div>

                            <div className='mb-3'>
                                <label htmlFor='createdAt' className='form-lable'>Ngày tạo</label>
                                <input id="createdAt" name="createdAt" type="text" className='form-control' value={productDetail ? productDetail.createdAt : ''} readOnly
                                />
                            </div>

                            <div className='mb-3'>
                                <label htmlFor='updatedAt' className='form-lable'>Ngày sửa</label>
                                <input id="updatedAt" name="updatedAt" type="text" className='form-control' value={productDetail ? productDetail.updatedAt : ''} readOnly
                                />
                            </div>

                            <div className='mb-3'>
                                <label htmlFor='photo' className='form-lable'>Product Photo</label>
                                <input id="photo" name="photo" type="file"
                                    className='form-control'
                                    
                                    />
                                    {productDetail && productDetail.imageProduct && (
                                        <img
                                            src={productDetail.imageProduct}
                                            alt={`Preview product Photo`}
                                            style={{ maxWidth: '300px', maxHeight: '300px' }}
                                            className='mb-3'           
                                        />        
                                    )}
                                
                            </div>
                    </div>
                </form>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

       </div>

       </div>
    </>
  )
}

export default AllProducts
