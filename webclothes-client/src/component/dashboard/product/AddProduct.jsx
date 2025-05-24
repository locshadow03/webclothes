import React, { useState } from 'react'
import { addProduct } from '../../../api/Product'
import { Link } from 'react-router-dom'
import CategoryTypeSelector from '../../common/CategoryTypeSelector';
import BrandTypeSelector from '../../common/BrandTypeSelector';

const AddProduct = () => {
    const [newProduct, setNewProduct] = useState({
        name:"",
        code:"",
        nameCategory:"",
        description:"",
        price:"",
        sizeQuantities: [],
        nameBrand:"",
        imageProduct: "",
        colorImageProducts: []
    });

    const [imagePreview, setImagePreview] = useState("");

    const [successMessage, setSuccessMessage] = useState("");

    const [errorMessage, setErrorMessage] = useState("");

    const handleProductInputChange = (e) => {
        const name = e.target.name;
        let value = e.target.value;
        if (name === "price" || name === "quantity" || name === "disCount") {
            if (!isNaN(value)) {
                value = parseInt(value);
            } else {
                value = "";
            }
        } 
        setNewProduct({ ...newProduct, [name]: value });
    };

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        setNewProduct({ ...newProduct, photo: selectedImage });
        setImagePreview(URL.createObjectURL(selectedImage));
    };

    const handleColorQuantityChange = (value, sizeIndex, colorIndex) => {
        const updatedSizeQuantities = [...newProduct.sizeQuantities];
        updatedSizeQuantities[sizeIndex].colorImageProductDtos[colorIndex].quantity = parseInt(value);
        setNewProduct({ ...newProduct, sizeQuantities: updatedSizeQuantities });
      };

    const handleAddSizeQuantity = () => {
        setNewProduct({
            ...newProduct,
            sizeQuantities: [
                ...newProduct.sizeQuantities,
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
        const updatedSizeQuantities = [...newProduct.sizeQuantities];
        updatedSizeQuantities[sizeIndex].colorImageProductDtos.push({
            color: "", 
            imageProduct: null,
            quantity: 0
        });
        setNewProduct({ ...newProduct, sizeQuantities: updatedSizeQuantities });
    };
    
    const handleSizeQuantityChange = (index, field, value) => {
        const updatedSizeQuantities = newProduct.sizeQuantities.map((item, idx) => 
            idx === index ? { ...item, [field]: value } : item
        );
        setNewProduct({ ...newProduct, sizeQuantities: updatedSizeQuantities });
    };

    const handleColorImageChange = (file, sizeIndex, colorIndex) => {
        const updatedSizeQuantities = [...newProduct.sizeQuantities];
    
      updatedSizeQuantities[sizeIndex].colorImageProductDtos[colorIndex].imageProduct = file;
      updatedSizeQuantities[sizeIndex].colorImageProductDtos[colorIndex].previewUrl = URL.createObjectURL(file);
    
      setNewProduct({ ...newProduct, sizeQuantities: updatedSizeQuantities });
      };
    
    const handleRemoveSizeQuantity = (index) => {
        const updatedSizeQuantities = newProduct.sizeQuantities.filter((_, idx) => idx !== index);
        setNewProduct({ ...newProduct, sizeQuantities: updatedSizeQuantities });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const success = await addProduct(
                newProduct.nameProduct,
                newProduct.codeProduct,
                newProduct.nameCategory,
                newProduct.description,
                newProduct.price,
                newProduct.sizeQuantities,
                newProduct.nameBrand,
                newProduct.photo
            );
            if (success !== undefined) {
                setSuccessMessage("A new product was added to the database!");
                setErrorMessage("");
                setNewProduct({
                    nameProduct: "",
                    codeProduct: "",
                    nameCategory: "",
                    description: "",
                    price: "",
                    sizeQuantities:[],
                    nameBrand: "",
                    photo: null
                });
                setImagePreview("");
            } else {
                setErrorMessage("Error adding product");
            }
        } catch (error) {
            setErrorMessage(error.message);
        }
    };
    const handleColorChange = (value, sizeIndex, colorIndex) => {
        const updatedSizeQuantities = [...newProduct.sizeQuantities];
        if (!updatedSizeQuantities[sizeIndex].colorImageProductDtos[colorIndex]) {
            updatedSizeQuantities[sizeIndex].colorImageProductDtos[colorIndex] = {
              color: '',
              imageProduct: null
            };
          }
        updatedSizeQuantities[sizeIndex].colorImageProductDtos[colorIndex].color = value;
        setNewProduct({ ...newProduct, sizeQuantities: updatedSizeQuantities });
      };

      
      const handleRemoveColor = (sizeIndex, colorIndex) => {
        const updated = [...newProduct.sizeQuantities];
        const currentColors = updated[sizeIndex]?.colorImageProductDtos || [];
        updated[sizeIndex].colorImageProductDtos = currentColors.filter((_, idx) => idx !== colorIndex);
        if (updated[sizeIndex].colorImageProductDtos.length === 0) {
            updated[sizeIndex].colorImageProductDtos = [];
        }
        setNewProduct({ ...newProduct, sizeQuantities: updated });
      };
      

    return (
        <div className='container'>
            <div className="mx-5">
                <h4 className="mx-5 mt-5">Thêm sản phẩm</h4>
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
                        <label htmlFor='nameProduct' className='form-label'>Name product</label>
                        <input
                            id="nameProduct"
                            name="nameProduct"
                            type="text"
                            className='form-control'
                            value={newProduct.nameProduct}
                            onChange={handleProductInputChange}
                        />
                        </div>
                    </div>

                    <div className='mb-3 col-6'>
                        <div className='mx-1'>
                        <label htmlFor='codeProduct' className='form-label'>Code product</label>
                        <input
                            id="codeProduct"
                            name="codeProduct"
                            type="text"
                            className='form-control'
                            value={newProduct.codeProduct}
                            onChange={handleProductInputChange}
                        />
                        </div>
                    </div>
                    </div>

                    <div className='mb-3'>
                        <label htmlFor='nameCategory' className='form-label'>Category name</label>
                        <div>
                            <CategoryTypeSelector handleProductInputChange={handleProductInputChange}
                            newProduct={newProduct} />
                        </div>
                    </div>

                    <div className='mb-3'>
                        <label htmlFor='description' className='form-label'>Description</label>
                        <textarea
                            id="description"
                            name="description"
                            className='form-control'
                            value={newProduct.description}
                            onChange={handleProductInputChange}
                        />
                    </div>

                    <div className='d-flex'>
                    <div className='mb-3 col-6'>
                        <div className='mx-1'>
                        <label htmlFor='price' className='form-label'>Price</label>
                        <input
                            id="price"
                            name="price"
                            type="number"
                            className='form-control'
                            value={newProduct.price}
                            onChange={handleProductInputChange}
                        />
                        </div>
                    </div>

                    </div>

                    <div className='mb-3'>
                    <label className='form-label'>Sizes & Quantities</label>
                    {newProduct.sizeQuantities.map((sizeQuantity, index) => {
                        

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

                            {sizeQuantity.colorImageProductDtos && sizeQuantity.colorImageProductDtos.length > 0 ? (
                                sizeQuantity.colorImageProductDtos.map((color, idx) => (
                                    <div key={idx} className="row align-items-center mb-3">
                                    <div className="col-md-3">
                                        <label className="form-label">Color</label>
                                        <input
                                        type="text"
                                        className="form-control"
                                        value={color.color}
                                        onChange={(e) => handleColorChange(e.target.value, index, idx)}
                                        />
                                    </div>

                                    <div className="col-md-3">
                                        <label className="form-label">Quantity</label>
                                        <input
                                        type="number"
                                        className="form-control"
                                        value={color.quantity}
                                        onChange={(e) => handleColorQuantityChange(e.target.value, index, idx)}
                                        />
                                    </div>

                                    <div className="col-md-3">
                                        <label className="form-label">Color Image</label>
                                        <br />
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
                                        className="form-control"
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
                            newProduct={newProduct} />
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
                                src={imagePreview}
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
    );
}

export default AddProduct;
