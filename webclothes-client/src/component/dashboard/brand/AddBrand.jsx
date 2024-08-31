import React, { useState } from 'react'
import { addBrand } from '../../../api/Brand'
import { Link } from 'react-router-dom'

const AddBrand = () => {
    const [newBrand, setNewBrand] = useState({
        nameBrand: "Nhập tên thương hiệu",
        photo: null
    })

    const [imagePreview, setImagePreview] = useState("")

    const [successMessage, setSuccessMessage] = useState("")

    const [errorMessage, setErrorMessage] = useState("")

    const handleBrandInputChange = (e) => {
        const name = e.target.name
        let value = e.target.value
        setNewBrand({ ...newBrand, [name]: value })
    }

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0]
        setNewBrand({ ...newBrand, photo: selectedImage })
        setImagePreview(URL.createObjectURL(selectedImage))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const success = await addBrand(newBrand.nameBrand,newBrand.photo)
            if (success !== undefined) {
                setSuccessMessage("A new brand was added to the database!")
                setNewBrand({ nameBrand: "",photo: null})
                setImagePreview("")
                setErrorMessage("")
            } else {
                setErrorMessage("Error adding brand")
            }
        } catch (error) {
            setErrorMessage(error.message)
        }
    }

  return (
    <>
        <div className='container'>
            <div classname = "mx-5">
                <h4 className = "mx-5 mt-5">Add brand</h4>
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

                <form className = "mx-5 mt-5" onSubmit={handleSubmit} style = {{backgroundColor: 'white', padding: '20px',boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'}}>
                    <div className='mb-3'>
                            <div className='mb-3'>
                                <label htmlFor='nameBrand' className='form-lable'>Name brand</label>
                                <input id="nameBrand" name="nameBrand" type="text" className='form-control' placeholder={newBrand.nameBrand}
                                    onChange={handleBrandInputChange}/>
                            </div>

                            <div className='mb-3'>
                                <label htmlFor='photo' className='form-lable'>Brand Photo</label>
                                <input id="photo" name="photo" type="file"
                                    className='form-control'
                                    onChange={handleImageChange}
                                    />
                                    {imagePreview && (
                                        <img src={imagePreview} alt="Preview Brand Photo"
                                            style={{ maxWidth: "300px", maxHeight: "300px" }}
                                            className='mb-3'
                                        />
                                    )}
                                
                            </div>

                            <div className="d-flex justify-content-between align-content-center mt-2">
                                <Link to = {"/dashboard/brand"} className='btn btn-info'>
                                    Back
                                </Link>
                                <button className='btn btn-primary ml-5'>Save Brand</button>
                            </div>
                    </div>
                </form>
            </div>
        </div>
    </>
  )
}

export default AddBrand
