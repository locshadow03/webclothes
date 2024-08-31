import React, { useEffect, useState } from 'react'
import { getProductById, updateProduct } from '../../../api/Product'
import CategoryTypeSelector from '../../common/CategoryTypeSelector'
import { Link, useParams } from 'react-router-dom'
import BrandTypeSelector from '../../common/BrandTypeSelector'

const EditProduct = () => {
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

    const [imagePreview, setImagePreview] = useState("")

    const [successMessage, setSuccessMessage] = useState("")

    const [errorMessage, setErrorMessage] = useState("")

    const {productId} = useParams()

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0]
        setProduct({ ...product, imageProduct: selectedImage })
        setImagePreview(URL.createObjectURL(selectedImage))
    }

    const handleProductInputChange = (event) => {
        const {name, value} = event.target
        setProduct({...product, [name] : value})
    }
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
    }, [productId])

    const handleSubmit = async (e) => {
      e.preventDefault()
      try {
          const response = await updateProduct(productId,product)
          if (response.status === 200){
            setSuccessMessage("product updated successfully!")
            const updateProductData = await getProductById(productId)
            setProduct(updateProductData)
			setImagePreview(`data:image/jpeg;base64,${updateProductData.imageProduct}`)
              setErrorMessage("")
          } else {
              setErrorMessage("Error updating product")
          }
      } catch (error) {
          setErrorMessage(error.message)
      }
  }

  const handleSizeQuantityChange = (index, field, value) => {
    const updatedSizeQuantities = product.sizeQuantities.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item
    );
    setProduct({ ...product, sizeQuantities: updatedSizeQuantities });
};

const handleAddSizeQuantity = () => {
    setProduct({
        ...product,
        sizeQuantities: [...product.sizeQuantities, { size: "", quantity: "" }]
    });
};

const handleRemoveSizeQuantity = (index) => {
    const updatedSizeQuantities = product.sizeQuantities.filter((_, idx) => idx !== index);
    setProduct({ ...product, sizeQuantities: updatedSizeQuantities });
};
  return (
    <div className='container'>
            <div className="mx-5">
                <h4 className="mx-5 mt-5">Sửa sản phẩm</h4>
                {successMessage && (
                    <div className="alert alert-success mx-5" role="alert">
                        {successMessage}
                    </div>
                )}

                {errorMessage && (
                    <div className="alert alert-danger mx-5" role="alert">
                        {errorMessage}
                    </div>
                )}

                <form className="mx-5 mt-5" onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '20px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                    <div className='d-flex'>
                    <div className='mb-3 col-6'>
                        <div className='mx-1'>
                        <label htmlFor='name' className='form-label'>Name product</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            className='form-control'
                            value={product.name}
                            onChange={handleProductInputChange}
                        />
                        </div>
                    </div>

                    <div className='mb-3 col-6'>
                        <div className='mx-1'>
                        <label htmlFor='code' className='form-label'>Code product</label>
                        <input
                            id="code"
                            name="code"
                            type="text"
                            className='form-control'
                            value={product.code}
                            onChange={handleProductInputChange}
                        />
                        </div>
                    </div>
                    </div>

                    <div className='mb-3'>
                        <label htmlFor='nameCategory' className='form-label'>Category name</label>
                        <div>
                            <CategoryTypeSelector handleProductInputChange={handleProductInputChange}
                            newProduct={product} />
                        </div>
                    </div>

                    <div className='mb-3'>
                        <label htmlFor='description' className='form-label'>Description</label>
                        <textarea
                            id="description"
                            name="description"
                            className='form-control'
                            value={product.description}
                            onChange={handleProductInputChange}
                        />
                    </div>

                    <div className='d-flex'>
                    <div className='mb-3 col-4'>
                        <div className='mx-1'>
                        <label htmlFor='price' className='form-label'>Price</label>
                        <input
                            id="price"
                            name="price"
                            type="number"
                            className='form-control'
                            value={product.price}
                            onChange={handleProductInputChange}
                        />
                        </div>
                    </div>

                    <div className='mb-3 col-4'>
                        <div className='mx-1'>
                        <label htmlFor='disCount' className='form-label'>Phiếu giảm giá</label>
                        <input
                            id="disCount"
                            name="disCount"
                            type="number"
                            className='form-control'
                            value={product.disCount}
                            onChange={handleProductInputChange}
                        />
                        </div>
                    </div>
                    </div>

                    <div className='mb-3'>
                        <label htmlFor='sizeQuantities' className='form-label'>Sizes and Quantities</label>
                        {product.sizeQuantities.map((sizeQuantity, index) => (
                            <div key={index} className='d-flex mb-2'>
                                <input
                                    type="text"
                                    className='form-control mr-2'
                                    placeholder="Size"
                                    value={sizeQuantity.size}
                                    onChange={(e) => handleSizeQuantityChange(index, 'size', e.target.value)}
                                />
                                <input
                                    type="number"
                                    className='form-control'
                                    placeholder="Quantity"
                                    value={sizeQuantity.quantity}
                                    onChange={(e) => handleSizeQuantityChange(index, 'quantity', e.target.value)}
                                />
                                <button
                                    type="button"
                                    className='btn btn-danger ml-2'
                                    onClick={() => handleRemoveSizeQuantity(index)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            className='btn btn-secondary'
                            onClick={handleAddSizeQuantity}
                        >
                            Add Size
                        </button>
                    </div>


                    <div className='mb-3'>
                        <label htmlFor='nameBrand' className='form-label'>Brand Name</label>
                        <BrandTypeSelector handleProductInputChange={handleProductInputChange}
                            newProduct={product} />
                    </div>

                    <div className='mb-3'>
                        <label htmlFor='photo' className='form-label'>Product Photo</label>
                        <input
                            id="photo"
                            name="photo"
                            type="file"
                            className='form-control'
                            onChange={handleImageChange}
                        />
                        {imagePreview && (
                            <img
                                src = {imagePreview}
                                alt="Preview product photo"
                                style={{ maxWidth: "300px", maxHeight: "300px" }}
                                className='mb-3'
                            />
                        )}
                    </div>

                    <div className="d-flex justify-content-between align-content-center mt-2">
                        <Link to="/dashboard/product" className='btn btn-info'>
                            Back
                        </Link>
                        <button type="submit" className='btn btn-primary ml-5'>Save Product</button>
                    </div>
                </form>
            </div>
        </div>
  )
}

export default EditProduct
