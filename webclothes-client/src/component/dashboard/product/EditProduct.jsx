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
        imageProduct: "",
        colorImageProducts: []

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
          
          setImagePreview(productData.imageProduct)
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
			setImagePreview(updateProductData.imageProduct)
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

const handleColorChange = (value, sizeIndex, colorIndex) => {
    const updatedSizeQuantities = [...product.sizeQuantities];
    updatedSizeQuantities[sizeIndex].colorImageProductDtos[colorIndex].color = value;
    setProduct({ ...product, sizeQuantities: updatedSizeQuantities });
  };
  
  // Thay đổi số lượng theo màu
  const handleColorQuantityChange = (value, sizeIndex, colorIndex) => {
    const updatedSizeQuantities = [...product.sizeQuantities];
    updatedSizeQuantities[sizeIndex].colorImageProductDtos[colorIndex].quantity = parseInt(value);
    setProduct({ ...product, sizeQuantities: updatedSizeQuantities });
  };

const handleColorImageChange = (file, sizeIndex, colorIndex) => {
    const updatedSizeQuantities = [...product.sizeQuantities];

  updatedSizeQuantities[sizeIndex].colorImageProductDtos[colorIndex].imageProduct = file;
  updatedSizeQuantities[sizeIndex].colorImageProductDtos[colorIndex].previewUrl = URL.createObjectURL(file);

  setProduct({ ...product, sizeQuantities: updatedSizeQuantities });
  };

  const handleRemoveColor = (sizeIndex, colorIndex) => {
    const updated = [...product.sizeQuantities];
    const currentColors = updated[sizeIndex]?.colorImageProductDtos || [];
    updated[sizeIndex].colorImageProductDtos = currentColors.filter((_, idx) => idx !== colorIndex);
    if (updated[sizeIndex].colorImageProductDtos.length === 0) {
        updated[sizeIndex].colorImageProductDtos = [];
    }
    setProduct({ ...product, sizeQuantities: updated });
  };

  const handleAddSizeQuantity = () => {
    setProduct({
        ...product,
        sizeQuantities: [
            ...product.sizeQuantities,
            {
                size: "",
                colorImageProductDtos: [
                    {
                        color: "",
                        imageProduct: null,
                        quantity: "",
                        previewUrl: null
                    }
                ]
            }
        ]
    });
};


const handleAddColor = (sizeIndex) => {
    const updatedSizeQuantities = [...product.sizeQuantities];
    updatedSizeQuantities[sizeIndex].colorImageProductDtos.push({
        color: "", 
        imageProduct: null,
        quantity: 0
    });
    setProduct({ ...product, sizeQuantities: updatedSizeQuantities });
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
                        {product.sizeQuantities.map((sizeQuantity, index) => {

                        return (
                        <div key={index} className='border rounded p-3 mb-3'>
                            <div className='d-flex justify-content-between align-items-center mb-2'>
                            <div className="col-md-2">
                            <label className="form-label"><strong>Size:</strong></label>
                            <input
                                type="text"
                                className="form-control"
                                value={sizeQuantity.size}
                                onChange={(e) => handleSizeQuantityChange(index, 'size', e.target.value)}
                            />
                            </div>
                            <button
                                type="button"
                                className='btn btn-danger btn-sm'
                                onClick={() => handleRemoveSizeQuantity(index)}
                            >
                                Remove Size
                            </button>
                            </div>

                            {sizeQuantity.colorImageProductDtos.length > 0 ? (sizeQuantity.colorImageProductDtos.map((color, idx) => (
                            <div key={idx} className='row align-items-center mb-3'>
                                <div className='col-md-3'>
                                <label className='form-label'>Color</label>
                                <input
                                    type="text"
                                    className='form-control'
                                    value={color.color}
                                    onChange={(e) => handleColorChange(e.target.value, index, idx)}
                                />
                                </div>

                                <div className='col-md-3'>
                                <label className='form-label'>Quantity</label>
                                <input
                                    type="number"
                                    className='form-control'
                                    value={color.quantity}
                                    onChange={(e) => handleColorQuantityChange(e.target.value, index, idx)}
                                />
                                </div>

                                <div className='col-md-3'>
                                <label className='form-label'>Color Image</label><br />
                                {color.previewUrl || color.imageProduct ? (
                                    <img
                                        src={color.previewUrl || color.imageProduct}
                                        alt="Color"
                                        className="img-thumbnail mb-2"
                                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                    />
                                    ) : (
                                    <div className="text-muted mb-2">No image</div>
                                    )}

                                <input
                                    type="file"
                                    className='form-control'
                                    
                                    onChange={(e) => handleColorImageChange(e.target.files[0], index, idx)}
                                />
                                </div>

                                <button
                                        type="button"
                                        onClick={() => handleRemoveColor(index, idx)}
                                        className="btn btn-outline-success btn-sm mb-2"
                                        style={{ width: "180px" }}
                                    >
                                        Xóa màu
                                </button>


                            </div>
                            ))
                            ) : (
                            <div>Bạn cần thêm màu!.</div>
                            )}

                            <button
                                type="button"
                                onClick={() => handleAddColor(index)}
                                className="btn btn-outline-success btn-sm mb-2" 
                                style={{width: '180px'}}
                            >
                                Thêm màu
                            </button>
                        </div>
                        );
                    })}

                    <button
                        type="button"
                        className='btn btn-secondary mt-2'
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
                            id="imageProduct"
                            name="imageProduct"
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
